FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
    imagemagick \
    webp \
    bc \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the optimization script
COPY docker/image-optimizer/optimize-images.sh /app/optimize-images.sh
RUN chmod +x /app/optimize-images.sh

# Set the entrypoint
ENTRYPOINT ["/app/optimize-images.sh"]