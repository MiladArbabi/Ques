provider "mongodbatlas" {
  public_key  = var.atlas_public_key
  private_key = var.atlas_private_key
}

resource "mongodbatlas_project" "ques" {
  name   = "ques-project"
  org_id = var.atlas_org_id
}

resource "mongodbatlas_cluster" "ques" {
  project_id   = mongodbatlas_project.ques.id
  name         = "ques-cluster"
  provider_name = "AWS"
  provider_region_name = "US_EAST_1"
  cluster_type = "REPLICASET"
}
