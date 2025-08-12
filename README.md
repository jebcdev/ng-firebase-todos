# 📝 Angular Firebase ToDo's App

> **Aplicación completa de gestión de tareas construida con Angular 20 y Firebase - Proyecto educativo**

[![Angular](https://img.shields.io/badge/Angular-20-red)](https://angular.io/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10-orange)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)](https://tailwindcss.com/)

## 🎯 Descripción del Proyecto

Esta es una aplicación completa de gestión de tareas (ToDo App) desarrollada con las últimas tecnologías de Angular y Firebase. El proyecto tiene fines **educativos** y demuestra las mejores prácticas en el desarrollo de aplicaciones web modernas, incluyendo arquitectura escalable, patrones de diseño, seguridad y experiencia de usuario.

### ✨ Características Principales

#### 🔐 **Sistema de Autenticación Completo**

- **Registro e inicio de sesión** con email/password
- **Autenticación con Google** (OAuth)
- **Guards de protección** de rutas
- **Manejo de estados** de autenticación en tiempo real
- **Roles de usuario** (Admin/User)
- **Logout seguro** con limpieza de estado

#### 📋 **Gestión Avanzada de Tareas**

- **CRUD completo** (Crear, Leer, Actualizar, Eliminar)
- **Estados de tareas**: Pendiente, En Progreso, Completada
- **Filtrado y búsqueda** en tiempo real
- **Ordenamiento personalizable**
- **Vista previa** antes de crear/editar
- **Confirmación** antes de eliminar
- **Estadísticas** de tareas por estado

#### 🎨 **Interfaz de Usuario Moderna**

- **Diseño responsive** para móvil, tablet y desktop
- **Dark theme** con colores profesionales
- **Animaciones suaves** y transiciones
- **Notificaciones toast** con ngx-sonner
- **Estados de carga** y feedback visual
- **Menús contextuales** inteligentes
- **Formularios reactivos** con validación

#### 🏗️ **Arquitectura y Patrones**

- **Standalone Components** (Angular 20)
- **Signals** para manejo de estado reactivo
- **Lazy Loading** de módulos y componentes
- **Inyección de dependencias** moderna
- **Servicios centralizados** para lógica de negocio
- **Interfaces TypeScript** para tipado fuerte
- **Estructura de carpetas** escalable

## 🚀 Tecnologías Utilizadas

### **Frontend**

- **Angular 20** - Framework principal
- **TypeScript 5.8** - Lenguaje de programación
- **RxJS 7** - Programación reactiva
- **Tailwind CSS 3.4** - Framework de estilos
- **NgxSonner** - Sistema de notificaciones

### **Backend & Base de Datos**

- **Firebase Authentication** - Autenticación
- **Firestore** - Base de datos NoSQL
- **Firebase Hosting** - Hosting (opcional)

### **Herramientas de Desarrollo**

- **Angular CLI 20** - Herramientas de desarrollo
- **Autoprefixer** - Post-procesamiento CSS
- **Prettier** - Formateo de código
- **ESLint** - Linting (configuración implícita)

## 📁 Estructura del Proyecto

```
ng-firebase-todos/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 auth/                    # Módulo de Autenticación
│   │   │   ├── 📁 guards/              # Guards de protección
│   │   │   │   ├── is-authenticated.ts
│   │   │   │   └── is-not-authenticated.ts
│   │   │   ├── 📁 interfaces/          # Interfaces de autenticación
│   │   │   │   └── auth.ts
│   │   │   ├── 📁 pages/               # Páginas de autenticación
│   │   │   │   ├── 📁 login/
│   │   │   │   │   ├── auth-login-page.ts
│   │   │   │   │   └── auth-login-page.html
│   │   │   │   └── 📁 register/
│   │   │   │       ├── auth-register-page.ts
│   │   │   │       └── auth-register-page.html
│   │   │   ├── 📁 services/            # Servicios de autenticación
│   │   │   │   └── auth.ts
│   │   │   └── auth.routes.ts          # Rutas de autenticación
│   │   ├── 📁 layout/                  # Componentes de layout
│   │   │   ├── 📁 components/
│   │   │   │   ├── layout-header.ts
│   │   │   │   ├── layout-main.ts
│   │   │   │   └── layout-footer.ts
│   │   │   └── layout.ts
│   │   ├── 📁 tasks/                   # Módulo de Tareas
│   │   │   ├── 📁 interfaces/          # Interfaces de tareas
│   │   │   │   └── task.ts
│   │   │   ├── 📁 pages/               # Páginas de tareas
│   │   │   │   ├── 📁 index/           # Lista de tareas
│   │   │   │   │   ├── 📁 components/
│   │   │   │   │   │   └── 📁 task-card/
│   │   │   │   │   │       ├── task-card.ts
│   │   │   │   │   │       └── task-card.html
│   │   │   │   │   ├── tasks-index-page.ts
│   │   │   │   │   └── tasks-index-page.html
│   │   │   │   ├── 📁 create/          # Crear tarea
│   │   │   │   │   ├── tasks-create-page.ts
│   │   │   │   │   └── tasks-create-page.html
│   │   │   │   └── 📁 edit/            # Editar tarea
│   │   │   │       ├── task-edit-page.ts
│   │   │   │       └── task-edit-page.html
│   │   │   ├── 📁 services/            # Servicios de tareas
│   │   │   │   └── task-service.ts
│   │   │   └── tasks.routes.ts         # Rutas de tareas
│   │   ├── app.config.ts               # Configuración de la app
│   │   ├── app.routes.ts               # Rutas principales
│   │   └── app.ts                      # Componente raíz
│   ├── 📁 environments/                # Configuraciones de entorno
│   │   ├── environment.ts              # Producción
│   │   └── environment.development.ts  # Desarrollo
│   ├── firebase.config.example.ts      # Plantilla de configuración
│   ├── main.ts                         # Punto de entrada
│   └── styles.css                      # Estilos globales
├── 📄 .env.example                     # Variables de entorno ejemplo
├── 📄 .gitignore                       # Archivos ignorados por Git
├── 📄 FIREBASE_SETUP.md                # Guía de configuración Firebase
├── 📄 angular.json                     # Configuración Angular
├── 📄 package.json                     # Dependencias del proyecto
├── 📄 tailwind.config.js               # Configuración Tailwind
└── 📄 tsconfig.json                    # Configuración TypeScript
```

## 🛠️ Instalación y Configuración

### **Prerrequisitos**

```bash
# Node.js 18+ y npm
node --version  # v18.0.0+
npm --version   # 9.0.0+

# Angular CLI (opcional pero recomendado)
npm install -g @angular/cli@20
```

### **1. Clonar el Repositorio**

```bash
git clone https://github.com/jebcdev/ng-firebase-todos.git
cd ng-firebase-todos
```

### **2. Instalar Dependencias**

```bash
npm install
```

### **3. Configurar Firebase**

#### **3.1 Crear Proyecto en Firebase**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** → **Sign-in method**:
   - Email/Password ✅
   - Google ✅
4. Habilita **Firestore Database**:
   - Modo: Start in test mode (para desarrollo)
   - Ubicación: tu región preferida

#### **3.2 Configurar Credenciales**

```bash
# Copiar archivo de configuración
cp src/firebase.config.example.ts src/firebase.config.ts
```

Edita `src/firebase.config.ts` con tus credenciales de Firebase:

```typescript
export const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-proyecto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "tu-app-id",
};
```

> 💡 **Obtener credenciales**: Firebase Console → Configuración del proyecto → Tus apps → Configuración

### **4. Iniciar Desarrollo**

```bash
npm run dev
# o
ng serve
```

Abre tu navegador en `http://localhost:4200` 🚀

## 📚 Guías de Desarrollo

### **🔥 Arquitectura del Código**

#### **Servicios Principales**

**AuthService** (`src/app/auth/services/auth.ts`)

```typescript
@Injectable({ providedIn: "root" })
export class AuthService {
  // Signals reactivos
  readonly isAuthenticated = computed(() => this._isAuthenticated());
  readonly currentUser = computed(() => this._currentUser());
  readonly isAdmin = computed(() => this._currentUser()?.role === "admin");

  // Métodos principales
  registerWithEmail(credentials: RegisterCredentials): Observable<AuthResult>;
  loginWithEmail(credentials: LoginCredentials): Observable<AuthResult>;
  loginWithGoogle(): Observable<AuthResult>;
  logout(): Observable<AuthResult>;
}
```

**TaskService** (`src/app/tasks/services/task-service.ts`)

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  // Signals computados
  readonly tasks = computed(() => this._tasks());
  readonly pendingTasks = computed(() => this._tasks().filter(t => t.status === 'pending'));
  readonly taskStats = computed(() => ({ total: ..., pending: ..., completed: ... }));

  // CRUD Operations
  getAllTasks(params?: TaskQueryParams): Observable<TaskServiceResult<Task[]>>
  getTaskById(taskId: string): Observable<TaskServiceResult<Task>>
  createNewTask(taskData: CreateTaskData): Observable<TaskServiceResult<Task>>
  updateTaskById(taskId: string, updateData: UpdateTaskData): Observable<TaskServiceResult<Task>>
  deleteTaskById(taskId: string): Observable<TaskServiceResult<boolean>>
}
```

#### **Guards de Protección**

**Rutas Protegidas** (`src/app/auth/guards/`)

```typescript
// is-authenticated.ts - Solo usuarios autenticados
export const isAuthenticatedGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? true : router.parseUrl("/auth/login");
};

// is-not-authenticated.ts - Solo usuarios no autenticados
export const isNotAuthenticatedGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return !authService.isAuthenticated() ? true : router.parseUrl("/");
};
```

#### **Interfaces TypeScript**

**User Interface** (`src/app/auth/interfaces/auth.ts`)

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole; // 'admin' | 'user'
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Task Interface** (`src/app/tasks/interfaces/task.ts`)

```typescript
export interface Task {
  id: string;
  user: User;
  title: string;
  description?: string;
  status: TaskStatus; // 'pending' | 'in-progress' | 'completed'
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### **🎨 Componentes Clave**

#### **TaskCard Component**

```typescript
@Component({
  selector: "task-card",
  templateUrl: "./task-card.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCard {
  // Inputs & Outputs
  task = input.required<Task>();
  editTask = output<Task>();
  deleteTask = output<Task>();
  changeStatus = output<{ task: Task; newStatus: TaskStatus }>();

  // Estado del menú contextual
  showMenu = signal(false);
  menuPosition = signal<"bottom-right" | "bottom-left" | "top-right" | "top-left">("bottom-right");
}
```

#### **Responsive Design**

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- **Grid adaptativo**: 1 columna (móvil) → 2 columnas (tablet) → 3 columnas (desktop)

### **🔒 Seguridad y Mejores Prácticas**

#### **Manejo de Credenciales**

```bash
# ❌ NO hacer commit de credenciales
src/firebase.config.ts        # En .gitignore

# ✅ SÍ hacer commit de plantillas
src/firebase.config.example.ts # Template seguro
.env.example                    # Variables de entorno ejemplo
```

#### **Validación de Formularios**

```typescript
// Registro con validaciones
registerForm = this.fb.group({
  name: ["", [Validators.required, Validators.minLength(2)]],
  email: ["", [Validators.required, Validators.email]],
  password: ["", [Validators.required, Validators.minLength(6)]],
});
```

#### **Manejo de Errores**

```typescript
// Error handling centralizado
catchError((error) => {
  console.error("Error obteniendo tareas:", error);
  toast.error("Error inesperado", {
    description: "Ocurrió un problema al cargar las tareas",
  });
  return throwError(() => ({
    success: false,
    error: "Error al cargar las tareas",
  }));
});
```

## 🎯 Funcionalidades Implementadas

### **Módulo de Autenticación**

- [x] Registro con email/password
- [x] Login con email/password
- [x] Autenticación con Google OAuth
- [x] Logout seguro
- [x] Guards de protección de rutas
- [x] Detección automática de estado de auth
- [x] Manejo de roles (Admin/User)
- [x] Validación de formularios
- [x] Mensajes de error personalizados

### **Módulo de Tareas**

- [x] **Crear tareas** con título, descripción y estado
- [x] **Listar tareas** con filtrado y búsqueda
- [x] **Editar tareas** con formulario pre-populado
- [x] **Eliminar tareas** con confirmación
- [x] **Cambiar estados** (Pendiente → En Progreso → Completada)
- [x] **Filtros dinámicos** por estado
- [x] **Búsqueda en tiempo real** en título y descripción
- [x] **Estadísticas** de tareas por estado
- [x] **Ordenamiento** por fecha, título, etc.
- [x] **Vista previa** antes de crear/editar

### **Experiencia de Usuario**

- [x] **Diseño responsive** móvil/tablet/desktop
- [x] **Dark theme** moderno
- [x] **Notificaciones toast** con ngx-sonner
- [x] **Estados de carga** y spinners
- [x] **Animaciones CSS** suaves
- [x] **Menús contextuales** inteligentes
- [x] **Navegación intuitiva**
- [x] **Feedback visual** en todas las acciones

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo (limpia cache)
npm start            # Inicia servidor de desarrollo
ng serve             # Angular CLI directo

# Producción
npm run build        # Build de producción
ng build --prod      # Build optimizado

# Testing
npm test             # Ejecuta tests unitarios
ng test              # Karma test runner

# Otros
npm run watch        # Build con watch mode
ng generate          # Scaffolding de código
ng add               # Agregar librerías
```

## 🔧 Configuración Avanzada

### **Tailwind CSS Personalizado**

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "gray-750": "#374151", // Color personalizado
      },
    },
  },
};
```

### **Path Mapping TypeScript**

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["src/app/*"],
      "@env/*": ["src/environments/*"]
    }
  }
}
```

### **Angular Configuration**

```json
// angular.json
{
  "schematics": {
    "@schematics/angular:component": {
      "skipTests": true, // Sin archivos de test
      "changeDetection": "OnPush" // Detección de cambios optimizada
    }
  }
}
```

## 📊 Métricas del Proyecto

- **📁 Archivos TypeScript**: ~30 archivos
- **🧩 Componentes**: 8 componentes standalone
- **🔧 Servicios**: 2 servicios principales (Auth, Tasks)
- **🛡️ Guards**: 2 guards de protección
- **📱 Páginas**: 5 páginas principales
- **🎨 Estilos**: Tailwind CSS + estilos personalizados
- **📦 Bundle size**: ~2MB (desarrollo), ~500KB (producción)

## 🐛 Troubleshooting

### **Problemas Comunes**

#### **Error de Firebase Configuration**

```bash
Error: Cannot find module '../firebase.config'
```

**Solución:**

```bash
cp src/firebase.config.example.ts src/firebase.config.ts
# Editar con tus credenciales reales
```

#### **Error de Índices en Firestore**

```bash
FirebaseError: The query requires an index
```

**Solución:**

- Clic en el enlace del error para crear el índice automáticamente
- O crear manualmente en Firebase Console → Firestore → Indexes

#### **Error de Autenticación**

```bash
Firebase Auth: Network request failed
```

**Solución:**

- Verificar configuración de Firebase
- Confirmar que Authentication está habilitado
- Revisar reglas de Firestore

### **Performance Tips**

#### **Optimización de Bundle**

```bash
# Análisis de bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/ng-firebase-todos/stats.json
```

#### **Lazy Loading Verificación**

```typescript
// Verificar que las rutas usan lazy loading
loadComponent: () => import("./path/to/component"); // ✅ Correcto
loadChildren: () => import("./path/to/routes"); // ✅ Correcto
component: MyComponent; // ❌ No lazy
```

## 🤝 Contribución

Este proyecto es con fines educativos. Las contribuciones son bienvenidas:

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

### **Convenciones de Código**

- **Commits**: Usar [Conventional Commits](https://www.conventionalcommits.org/)
- **Naming**: camelCase para métodos, PascalCase para clases
- **Componentes**: Standalone components con OnPush change detection
- **Servicios**: Injectable en root con signals para estado

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la **MIT License**.

## 👨‍💻 Autor

**Tu Nombre**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- Email: tu.email@ejemplo.com

## 🙏 Agradecimientos

- **Angular Team** por el excelente framework
- **Firebase Team** por la plataforma backend
- **Tailwind CSS** por el framework de estilos
- **Community** por las librerías open source utilizadas

---

### 📖 **¿Quieres aprender más?**

Este proyecto demuestra conceptos avanzados de Angular y Firebase. Explora el código, experimenta con las funcionalidades y úsalo como base para tus propios proyectos.

**Happy Coding!** 🚀✨

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
