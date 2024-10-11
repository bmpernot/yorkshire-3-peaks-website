#!/bin/bash
docker network disconnect backend_sam-local-network Y3P || echo 'Dev container has already been removed from the network'

docker compose -f ./docker.compose.yaml down --volumes