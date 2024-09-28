variable "hcloud_token" {
  type = string
}

variable "private_key_path" {
  type = string
}

variable "ssh_key" {
  type = list(string)
}

variable "branch_name" {
  type = string
}

variable "branch_port" {
  type = string
}

variable "cloudflare_zone_id" {
  type = string
}

variable "cloudflare_email" {
  type = string
}

variable "cloudflare_api_key" {
  type = string
}
