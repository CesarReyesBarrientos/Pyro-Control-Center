# 📱 Guía de Instalación PWA en iPhone

## ✅ Preparación Completada
- ✅ Build de producción con soporte iOS
- ✅ Meta tags de Apple agregadas
- ✅ Iconos para iOS configurados
- ✅ Servidor corriendo

---

## 🌐 Tu IP Local
**Dirección WiFi:** `10.13.67.235`

**URLs disponibles:**
- Desde tu PC: http://localhost:8080
- Desde iPhone (misma red): http://10.13.67.235:8080

---

## 📲 Pasos para Instalar en iPhone

### 1️⃣ Verifica la Conexión
- Asegúrate que tu **iPhone** y tu **PC** están en la **misma red WiFi**
- Si tu PC tiene firewall, asegúrate que permita conexiones en el puerto 8080

### 2️⃣ Abre Safari en el iPhone
⚠️ **IMPORTANTE:** Debes usar **Safari**, NO Chrome ni otro navegador

1. Abre **Safari** en tu iPhone
2. En la barra de direcciones escribe:
   ```
   http://10.13.67.235:8080
   ```
3. Presiona **Ir**

### 3️⃣ Agrega a Pantalla de Inicio
1. Cuando la página cargue, toca el botón **Compartir** (📤) en la parte inferior
2. Desplázate hacia abajo y toca **"Agregar a pantalla de inicio"**
3. Verás un preview con el ícono y nombre "Pyro Control Center"
4. Puedes editar el nombre si quieres (máx 12 caracteres para que se vea completo)
5. Toca **"Agregar"** en la esquina superior derecha

### 4️⃣ Abre la App
1. Ve a tu pantalla de inicio
2. Verás el ícono de "Pyro Control Center"
3. Tócalo para abrir la app
4. Se abrirá en **modo standalone** (pantalla completa, sin barra de Safari)

---

## 🔧 Solución de Problemas

### ❌ "No se puede acceder a la página"
**Causa:** iPhone y PC no están en la misma red WiFi

**Solución:**
1. Verifica que ambos estén conectados a la misma red
2. En el iPhone: Configuración → WiFi → verifica el nombre de la red
3. En el PC: Configuración → Red → verifica que sea la misma red

### ❌ "Conexión rechazada" o "Timeout"
**Causa:** Firewall de Windows bloqueando el puerto 8080

**Solución en Windows:**
1. Abre PowerShell como **Administrador**
2. Ejecuta:
```powershell
New-NetFirewallRule -DisplayName "Node PWA Server" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

### ❌ El ícono se ve mal o genérico
**Causa:** Los iconos temporales no están optimizados

**Solución:**
- Genera iconos profesionales en https://realfavicongenerator.net/
- Reemplázalos en `src/assets/icons/`
- Recompila: `ng build --configuration production`
- Reinstala la PWA en el iPhone

### ❌ "Agregar a pantalla de inicio" no aparece
**Causa:** No estás usando Safari o la página no cargó correctamente

**Solución:**
- Usa Safari (es el único navegador en iOS que soporta PWA)
- Recarga la página
- Verifica que el servidor esté corriendo

---

## 📊 Diferencias entre iOS y Android

| Característica | Android (Chrome) | iOS (Safari) |
|----------------|------------------|--------------|
| Service Worker | ✅ Full support | ⚠️ Limitado |
| Offline | ✅ Completo | ⚠️ Parcial |
| Push Notifications | ✅ Sí | ❌ No (iOS 16.4+) |
| Instalación | Prompt automático | Manual (Compartir) |
| Fullscreen | ✅ Sí | ✅ Sí |
| Background Sync | ✅ Sí | ❌ No |

---

## 🎯 Características que Funcionan en iPhone

✅ Instalación como app nativa  
✅ Ícono en pantalla de inicio  
✅ Splash screen personalizado  
✅ Modo standalone (sin barra Safari)  
✅ Cache de assets básicos  
⚠️ Service Worker limitado (iOS tiene restricciones)  
❌ Push notifications (no soportadas en PWA iOS)  

---

## 🔄 Actualizar la PWA

Cuando hagas cambios:

1. Recompila:
```powershell
ng build --configuration production
```

2. Reinicia el servidor:
- Presiona Ctrl+C en la terminal
- Ejecuta: `node spa-server.js`

3. En el iPhone:
- Abre la PWA instalada
- Ciérrala completamente (desliza hacia arriba)
- Ábrela de nuevo
- Safari detectará la nueva versión automáticamente

---

## 🚀 Para Producción (Internet público)

Para que funcione fuera de tu red local:

1. **Dominio con HTTPS** (obligatorio para service workers)
2. **Deploy en servidor** (Netlify, Vercel, Firebase Hosting, etc.)
3. **Configurar Auth0** con la URL de producción
4. **Certificado SSL** válido

### Opción Rápida: Netlify (Gratis)

```powershell
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
cd dist/pcc/browser
netlify deploy --prod
```

Te dará una URL pública tipo: `https://tu-app.netlify.app`

---

## 📝 Notas Importantes

1. **iOS requiere HTTPS** en producción (localhost funciona sin SSL)
2. **Safari es obligatorio** para instalar PWA en iOS
3. **Service Worker** en iOS tiene limitaciones vs Android
4. **Actualiza iOS** a la última versión para mejor soporte PWA
5. **Cache en iOS** se limpia agresivamente después de 2 semanas sin uso

---

## ✅ Checklist de Verificación

- [ ] PC y iPhone en la misma WiFi
- [ ] Servidor corriendo en http://10.13.67.235:8080
- [ ] Firewall permite puerto 8080
- [ ] Usando Safari en iPhone (NO Chrome)
- [ ] Página carga correctamente
- [ ] Botón "Agregar a pantalla de inicio" visible
- [ ] Ícono aparece en pantalla de inicio
- [ ] App abre en modo standalone

---

**¿Tienes algún problema? Revisa la sección "Solución de Problemas" arriba.**
