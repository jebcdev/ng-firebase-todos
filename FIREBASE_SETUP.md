# Firebase Configuration Setup

## Configuración de Firebase (Método Seguro)

Este proyecto utiliza un archivo de configuración separado para proteger las credenciales de Firebase.

### Pasos para la configuración:

1. **Copia el archivo de ejemplo:**

   ```bash
   cp src/firebase.config.example.ts src/firebase.config.ts
   ```

2. **Edita el archivo `src/firebase.config.ts` con tus credenciales reales de Firebase:**

   ```typescript
   export const firebaseConfig = {
     apiKey: "tu-api-key-aqui",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-project-id",
     storageBucket: "tu-proyecto.firebasestorage.app",
     messagingSenderId: "tu-sender-id",
     appId: "tu-app-id",
   };
   ```

3. **Obtén las credenciales desde Firebase Console:**
   - Ve a Firebase Console > Tu Proyecto > ⚙️ Project Settings
   - Scroll down hasta "Your apps"
   - Selecciona tu app web y copia la configuración

### ⚠️ Importante para desarrolladores:

- **❌ NO** commits el archivo `src/firebase.config.ts`
- **✅ SÍ** commits el archivo `src/firebase.config.example.ts`
- El archivo real está en `.gitignore` para proteger tus credenciales

### Para nuevos desarrolladores del equipo:

1. Clona el repositorio
2. Copia `src/firebase.config.example.ts` → `src/firebase.config.ts`
3. Solicita las credenciales al administrador del proyecto
4. Completa el archivo con las credenciales reales

### Estructura del proyecto:

```
├── .env                              # ❌ NO commitear (alternativo)
├── .env.example                     # ✅ Commitear (plantilla alternativa)
├── src/
│   ├── firebase.config.ts           # ❌ NO commitear (credenciales reales)
│   ├── firebase.config.example.ts   # ✅ Commitear (plantilla)
│   └── environments/
│       ├── environment.ts           # ✅ Commitear (importa firebase.config)
│       └── environment.development.ts # ✅ Commitear (importa firebase.config)
```

### Para producción (CI/CD):

Configura las variables de entorno en tu plataforma:

**Vercel:**

```bash
# En Project Settings > Environment Variables
FIREBASE_CONFIG={"apiKey":"...","authDomain":"..."}
```

**Netlify:**

```bash
# En Site Settings > Environment Variables
FIREBASE_API_KEY=tu-api-key
FIREBASE_AUTH_DOMAIN=tu-dominio
# ... etc
```

### Troubleshooting:

❌ **Error: `Cannot find module '../firebase.config'`**

```bash
# Solución:
cp src/firebase.config.example.ts src/firebase.config.ts
# Luego edita el archivo con tus credenciales
```

❌ **Error: Firebase authentication**

1. Verifica que las credenciales son correctas
2. Confirma que Firebase Authentication está habilitado
3. Revisa las reglas de Firestore

### Métodos alternativos:

Si prefieres usar variables de entorno `.env`, están configuradas como alternativa. Ver archivo `.env.example`.
