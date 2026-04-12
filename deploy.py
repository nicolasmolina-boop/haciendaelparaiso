#!/usr/bin/env python3
"""
Deploy script - Hacienda El Paraíso
Sube archivos a GoDaddy vía SFTP usando Paramiko.
Credenciales desde .env
"""

import os
import sys
from pathlib import Path

try:
    import paramiko
except ImportError:
    print("ERROR: paramiko no instalado. Instalar con: python -m pip install paramiko")
    sys.exit(1)


def load_env(path=".env"):
    """Carga variables de .env sin dependencias externas."""
    env = {}
    env_file = Path(path)
    if not env_file.exists():
        print(f"ERROR: archivo {path} no encontrado")
        sys.exit(1)

    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" in line:
            key, _, value = line.partition("=")
            env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def main():
    # Cambiar a directorio del script
    script_dir = Path(__file__).parent.resolve()
    os.chdir(script_dir)

    env = load_env()
    host = env.get("SFTP_HOST")
    user = env.get("SFTP_USER")
    password = env.get("SFTP_PASS")

    if not all([host, user, password]):
        print("ERROR: SFTP_HOST, SFTP_USER o SFTP_PASS no definidos en .env")
        sys.exit(1)

    # Archivos raíz a subir
    root_files = [
        "index.html",
        "estilos.css",
        "script.js",
        "privacidad.html",
        "terminos.html",
        "refugio-pastoral.html",
        "sitemap.xml",
        "robots.txt",
    ]

    # Todas las imágenes de img/
    img_folder = script_dir / "img"
    img_files = []
    if img_folder.exists():
        for item in sorted(img_folder.iterdir()):
            # Saltar la carpeta de originales (backup)
            if item.is_file() and item.name != "originales":
                img_files.append(item.name)

    print("=" * 60)
    print(" DEPLOY - Hacienda El Paraíso")
    print("=" * 60)
    print(f" Host: {host}")
    print(f" Usuario: {user}")
    print(f" Archivos raíz: {len(root_files)}")
    print(f" Imágenes: {len(img_files)}")
    print("=" * 60)
    print()

    # Conectar
    print("Conectando a SFTP...")
    try:
        transport = paramiko.Transport((host, 22))
        transport.connect(username=user, password=password)
        sftp = paramiko.SFTPClient.from_transport(transport)
        print("Conectado.")
        print()
    except Exception as e:
        print(f"ERROR al conectar: {e}")
        sys.exit(1)

    uploaded = 0
    failed = 0
    total_bytes = 0

    # Subir archivos raíz
    print("Subiendo archivos raíz...")
    for filename in root_files:
        local_path = script_dir / filename
        if not local_path.exists():
            print(f"  [SKIP] {filename} (no existe local)")
            continue
        try:
            size = local_path.stat().st_size
            sftp.put(str(local_path), f"./{filename}")
            total_bytes += size
            size_kb = round(size / 1024, 1)
            print(f"  [OK] {filename} ({size_kb} KB)")
            uploaded += 1
        except Exception as e:
            print(f"  [ERROR] {filename}: {e}")
            failed += 1

    # Asegurar que exista img/
    print()
    print("Subiendo imágenes...")
    try:
        sftp.stat("./img")
    except FileNotFoundError:
        try:
            sftp.mkdir("./img")
            print("  [INFO] carpeta img/ creada")
        except Exception:
            pass

    for filename in img_files:
        local_path = img_folder / filename
        try:
            size = local_path.stat().st_size
            sftp.put(str(local_path), f"./img/{filename}")
            total_bytes += size
            size_kb = round(size / 1024, 1)
            print(f"  [OK] img/{filename} ({size_kb} KB)")
            uploaded += 1
        except Exception as e:
            print(f"  [ERROR] img/{filename}: {e}")
            failed += 1

    sftp.close()
    transport.close()

    total_mb = round(total_bytes / (1024 * 1024), 2)

    print()
    print("=" * 60)
    print(f" DEPLOY COMPLETO")
    print(f" Archivos subidos: {uploaded}")
    print(f" Fallidos: {failed}")
    print(f" Total: {total_mb} MB")
    print("=" * 60)

    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()
