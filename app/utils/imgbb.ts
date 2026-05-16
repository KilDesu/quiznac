import { basename, extname } from "@tauri-apps/api/path";
import { readFile } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";

export interface ImgbbResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

export async function addImageToDb(
  opts: { path: string } | { url: string },
): Promise<string> {
  const apiKey = await run("get_imgbb_key");

  const data = new FormData();

  if ("path" in opts) {
    const { path } = opts;
    const file = await readFile(path);
    const extension = await extname(path);
    const name = await basename(path);

    const blob = new Blob([file], { type: `image/${extension}` });
    data.append("image", blob, name);
  } else {
    data.append("image", opts.url);
  }

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: data,
  });

  const json = (await response.json()) as ImgbbResponse;

  if (json.success) {
    return json.data.url;
  }

  console.error({ data: data.get("image"), json, response });

  throw new Error(
    `Impossible d'ajouter l'image à ImgBB. Le serveur a répondu avec le statut ${json.status}`,
  );
}
