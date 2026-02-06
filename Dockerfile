FROM oven/bun:latest

WORKDIR /bot

COPY package.json /bot/
COPY bun.lock /bot/

RUN bun install

COPY . /bot

RUN bun run build

EXPOSE 8080

CMD ["bun", "dist/index.js"]
