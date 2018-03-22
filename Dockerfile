FROM nginx

RUN apt update && apt install -y jq curl

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && mv kubectl /usr/local/bin && chmod +x /usr/local/bin/kubectl


COPY site/ /usr/share/nginx/html/
COPY get-data /usr/local/bin/
COPY loop-get-data /usr/local/bin/
COPY entrypoint /usr/local/bin/

RUN chmod +x /usr/local/bin/get-data


CMD ["/usr/local/bin/entrypoint"]
