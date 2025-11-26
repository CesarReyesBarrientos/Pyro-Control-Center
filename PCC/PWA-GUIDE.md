# Guía PWA - Pyro Control Center

## ✅ Configuración Completada

Tu aplicación Angular ya está configurada como PWA con:
- ✅ Service Worker configurado (`ngsw-config.json`)
- ✅ Web App Manifest (`src/manifest.webmanifest`)
- ✅ Registro de Service Worker en `app.config.ts`
- ✅ Links del manifest en `index.html`

## 📦 Instalar Dependencia (si no está)

```powershell
cd "C:\Users\gisel\OneDrive - Universidad Autónoma de Aguascalientes\Escritorio\clonado\Pyro-Control-Center\PCC"
npm install @angular/service-worker --save
```

## 🎨 Generar Iconos PWA

**Necesitas crear iconos en estos tamaños:**
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

### Opción 1: Generador Online (Recomendado)
1. Ve a https://realfavicongenerator.net/ o https://www.pwabuilder.com/imageGenerator
2. Sube tu logo/icono (mínimo 512x512 px)
3. Descarga todos los tamaños
4. Copia los archivos a: `src/assets/icons/`

### Opción 2: Manual con PowerShell
Si tienes ImageMagick instalado:

```powershell
# Crear carpeta de iconos
New-Item -ItemType Directory -Force -Path "src/assets/icons"

# Desde un PNG de 512x512 llamado "logo.png"
magick logo.png -resize 72x72 src/assets/icons/icon-72x72.png
magick logo.png -resize 96x96 src/assets/icons/icon-96x96.png
magick logo.png -resize 128x128 src/assets/icons/icon-128x128.png
magick logo.png -resize 144x144 src/assets/icons/icon-144x144.png
magick logo.png -resize 152x152 src/assets/icons/icon-152x152.png
magick logo.png -resize 192x192 src/assets/icons/icon-192x192.png
magick logo.png -resize 384x384 src/assets/icons/icon-384x384.png
magick logo.png -resize 512x512 src/assets/icons/icon-512x512.png
```

## 🏗️ Build de Producción

```powershell
# Build con service worker habilitado
ng build --configuration production
```

El Service Worker **solo funciona en builds de producción**, NO en `ng serve`.

## 🧪 Probar la PWA Localmente

### 1. Instalar http-server (solo una vez)
```powershell
npm install -g http-server
```

### 2. Servir el build de producción
```powershell
# Desde la carpeta PCC
http-server -p 8080 -c-1 dist/pcc/browser
```

### 3. Abrir en el navegador
- URL: http://localhost:8080
- Abre **Chrome DevTools** → pestaña **Application**
- Verifica:
  - ✅ Service Worker registrado
  - ✅ Manifest cargado
  - ✅ Cache Storage poblado

## 📱 Instalar en el Dispositivo

### En Chrome Desktop:
1. Abre http://localhost:8080
2. Busca el ícono ➕ en la barra de direcciones
3. Click en "Instalar"

### En Chrome Android:
1. Abre la URL en el navegador
2. Menú → "Agregar a pantalla de inicio"

## 🔍 Auditoría con Lighthouse

### En Chrome DevTools:
1. F12 → pestaña **Lighthouse**
2. Selecciona "Progressive Web App"
3. Click en "Generate report"
4. Debe dar 100% en PWA

## 🚀 Deploy en Producción

Cuando subas a un servidor real:

1. **HTTPS es obligatorio** (excepto localhost)
2. Actualiza las URLs de API en `ngsw-config.json`:
   ```json
   "urls": [
     "https://tudominio.com/api/**"
   ]
   ```
3. Actualiza `start_url` en `manifest.webmanifest` si no está en la raíz

## 📝 Personalización del Manifest

Edita `src/manifest.webmanifest` para cambiar:
- `name`: Nombre completo de la app
- `short_name`: Nombre corto (máx 12 caracteres)
- `theme_color`: Color de la barra de estado
- `background_color`: Color de splash screen
- `description`: Descripción de la app

## 🔄 Actualizar Service Worker

Cuando hagas cambios:
```powershell
ng build --configuration production
```

El service worker detectará automáticamente nuevas versiones y las instalará.

## ⚠️ Troubleshooting

### Service Worker no aparece
- Verifica que estés en producción (`ng build`)
- Verifica que estés en HTTPS o localhost
- Limpia cache: DevTools → Application → Clear storage

### Iconos no aparecen
- Verifica que existan en `src/assets/icons/`
- Verifica los nombres en `manifest.webmanifest`
- Rebuild: `ng build --configuration production`

### Cache muy agresivo
Ajusta en `ngsw-config.json`:
```json
"strategy": "freshness"  // Para datos frescos
"strategy": "performance"  // Para cache agresivo
```

## 📚 Más Info
- [Angular Service Worker](https://angular.io/guide/service-worker-intro)
- [Web App Manifest](https://web.dev/add-manifest/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
