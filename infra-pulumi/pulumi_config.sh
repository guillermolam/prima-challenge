pulumi config set aws:region eu-west-3
cat ~/.ssh/prisma_challenge_public.pem | pulumi config set prisma-website:publicKey --secret --
cat ~/.ssh/prisma_challenge_private.pem | pulumi config set prisma-website:publicKey --secret --