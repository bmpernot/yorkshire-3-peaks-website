FROM cypress/browsers:node-22.19.0

SHELL [ "/bin/bash", "-o", "pipefail", "-c" ]

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" && \
    echo "$SNIPPET" >> "/root/.bashrc"
