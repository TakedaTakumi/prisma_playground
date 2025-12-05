FROM node:22 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# タイムゾーン設定
RUN apt-get update && apt-get install -y tzdata \
    && ln -fs /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata

ENV TZ=Asia/Tokyo

ARG USERNAME=node

FROM base

# package.jsonで指定されたバージョンのpnpmを準備
RUN corepack install -g pnpm@10.18.3

RUN mkdir -p /prisma_playground /pnpm && \
  chown -R ${USERNAME}:${USERNAME} /prisma_playground /pnpm

WORKDIR /prisma_playground

COPY --chown=${USERNAME}:${USERNAME} package.json pnpm-lock.yaml ./

USER ${USERNAME}

RUN pnpm install

COPY --chown=${USERNAME}:${USERNAME} prisma ./prisma
RUN pnpm gen


