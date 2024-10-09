FROM cypress/browsers:node-20.17.0-chrome-129.0.6668.70-1-ff-130.0.1-edge-129.0.2792.52-1

SHELL [ "/bin/bash", "-o", "pipefail", "-c" ]

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" && \
    echo "$SNIPPET" >> "/root/.bashrc"
