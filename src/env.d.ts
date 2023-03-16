/// <reference types="@astrojs/image/client" />
interface ImportMetaEnv {
  readonly DB_PASSWORD: 'asdf';
  readonly PUBLIC_POKEAPI: 'wowee';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
