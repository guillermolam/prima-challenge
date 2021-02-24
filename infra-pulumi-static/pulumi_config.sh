pulumi config set aws:region eu-west-3
cat ~/.ssh/id_rsa.pub | pulumi config set prisma-website:publicKey --secret --
cat ~/.ssh/id_rsa | pulumi config set prisma-website:publicKey --secret --