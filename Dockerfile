FROM oven/bun:1.1

RUN apt-get update && apt-get install -y --no-install-recommends \
	git \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /prisma_playground

COPY . ./

CMD ["/bin/sh", "-c", "bun install && bun prisma studio"]
