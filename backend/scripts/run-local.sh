#!/bin/bash
rm -rf /workspaces/yorkshire-3-peaks-website/backend/.aws-sam

docker compose -f ./docker.compose.yaml up -d

docker network connect backend_sam-local-network Y3P || echo 'Dev container is already connected to network'

sam local start-api --docker-network backend_sam-local-network --warm-containers EAGER --port 3001 --container-host host.docker.internal --container-host-interface 0.0.0.0 --docker-volume-basedir ${LOCAL_WORKSPACE_FOLDER:-..}/backend