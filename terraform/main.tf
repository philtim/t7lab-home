terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "1.48.1"
    }
  }
}

provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_server" "shared_preview_server" {
  name        = "t7lab-debian"
  server_type = "cx22"
  image       = "debian12"
  location    = "nbg1"
  ssh_keys    = [var.ssh_key]

  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "sudo apt install -y nginx",
      "sudo systemctl enable nginx",
      "sudo systemctl start nginx"
    ]

    connection {
      type        = "ssh"
      user        = "phil"
      private_key = file(var.private_key_path)
      host        = self.ipv4_address
    }
  }
}

output "shared_server_ip" {
  value = hcloud_server.shared_preview_server.ipv4_address
}
