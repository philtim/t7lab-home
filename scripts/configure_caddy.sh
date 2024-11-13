#!/bin/bash

branch_name=$1
initial_port=$2
delete_flag=$3

caddyfile="/etc/caddy/Caddyfile"
subdomain="${branch_name}--preview.t7lab.com"

# Function to check if a port is in use in the Caddyfile
is_port_used() {
    local port=$1
    grep -q "\[::1\]:${port}" "$caddyfile"
    return $?
}

# Function to find the next available port
find_available_port() {
    local port=$1
    while [[ $port -le 8500 ]]; do
        if ! is_port_used $port; then
            echo $port
            return 0
        fi
        ((port++))
    done
    echo "No available ports found in range 8000-8500" >&2
    exit 1
}

if [[ "$delete_flag" == "--delete" ]]; then
    # Delete the existing entry for this subdomain
    if grep -q "${subdomain}" "$caddyfile"; then
        sudo sed -i "/http:\/\/${subdomain} {/,/}/d" "$caddyfile"
        echo "Deleted entry for ${subdomain}."
    else
        echo "No entry found for ${subdomain}."
    fi
else
    # Find an available port
    port=$(find_available_port $initial_port)
    reverse_proxy_entry="http://${subdomain} {\n  reverse_proxy [::1]:${port}\n}\n"

    # Check if the branch is already present in the Caddyfile
    if grep -q "${subdomain}" "$caddyfile"; then
        # Use sed to replace the existing entry for this subdomain
        sudo sed -i "/http:\/\/${subdomain} {/,/}/c\\${reverse_proxy_entry}" "$caddyfile"
    else
        # Append a new entry at the end of the Caddyfile
        echo -e "$reverse_proxy_entry" | sudo tee -a "$caddyfile" > /dev/null
    fi

    # Echo the selected port so it can be captured by the calling script if needed
    echo $port
fi

# Reload Caddy to apply changes
sudo systemctl reload caddy
