# ⚠️ DO NOT TOUCH — Hono Runtime Data Rule

Zhen instruction — 2026-05-14:

- Jangan sembarang edit / cleanup / rebuild runtime 9router folder ini tanpa jelas perlu.
- Kalau edit 9router, **jangan ubah path env `DATA_DIR`** ke path lain.
- Hono VPS runtime wajib pakai:

```env
DATA_DIR=/root/.9router
```

- DB aktif wajib tetap:

```txt
/root/.9router/db/data.sqlite
```

- Jangan pindah ke:

```txt
/var/lib/9router/db/data.sqlite
```

- Jangan hapus / overwrite / migrate DB tanpa explicit approval Zhen.
- Kalau restart Hono, pakai env explicit:

```bash
DATA_DIR=/root/.9router pm2 restart 9router-hono-8323 --update-env
```

- Hono PM2 live:

```txt
9router-hono-8323
```

Treat `/root/.9router/db/data.sqlite` as production data.
