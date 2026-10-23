# Liga Yaquis

Sitio de la liga con Next.js y MySQL. Las páginas públicas consultan la base de datos y el panel `/admin` requiere una cuenta activa con rol administrador. El acceso está en `/login` y en el menú del sitio.

## Preparación

1. Instalar dependencias con `npm install`.
2. Crear una base MySQL vacía (por ejemplo, `liga`) con codificación `utf8mb4`.
3. Copiar `.env.example` a `.env.local` y completar la conexión y los datos del administrador inicial. No subir este archivo al repositorio.
4. Ejecutar `npm run db:setup` para crear las tablas, los catálogos iniciales y el administrador. El comando se puede repetir: conserva las cuentas y datos existentes. No cambia la contraseña ni el rol de una cuenta que ya exista con el mismo correo.
5. Ejecutar `npm run dev` y abrir `http://localhost:3000/login`.

Los catálogos iniciales incluyen divisiones I, II y III, categorías Libre, Veteranos y Juvenil, temporada 2026, Cancha Yaquis y cuatro posiciones. No se cargan equipos, jugadores ni estadísticas de demostración.

## Administración

- **Usuarios:** altas, edición, roles administrador/usuario, activación y eliminación. Un usuario normal no puede consultar ni modificar información administrativa. No se permite quitarse el acceso administrativo ni eliminar la propia cuenta.
- **Catálogos:** divisiones, categorías, temporadas, sedes y posiciones. Se pueden agregar, editar, desactivar y eliminar cuando no tienen referencias. El tipo de un catálogo existente es fijo.
- **Inscripciones:** solicitudes públicas persistentes con responsable, correo, teléfono, división, categoría, temporada, cantidad de jugadores y logo opcional. Aprobar una solicitud crea su equipo en una transacción; rechazarla conserva el registro. Aprobar una solicitud no crea automáticamente los jugadores: se capturan en Jugadores.
- **Equipos:** datos del equipo, director técnico, responsable, competencia, colores y logo. Se aceptan PNG, JPEG y WebP hasta 2 MB. Los archivos se guardan en MySQL, por lo que sobreviven a reinicios y despliegues.
- **Jugadores:** equipo, número de camiseta único dentro del equipo, posición y estado. No se permite transferir a un jugador con goles registrados.
- **Partidos y resultados:** fecha y hora local de la liga, jornada, sede, participantes y marcador final. Los equipos deben pertenecer a la misma temporada y categoría; pueden ser de distintas divisiones para un partido interzona. Se captura como cualquier otro partido y aparece en los filtros de ambas divisiones, tanto en partidos como en el calendario. Su resultado y anotaciones cuentan en las estadísticas de cada equipo y en la tabla de su propia división.
- **Goles por jugador:** anotaciones por partido finalizado. Los goles individuales se validan contra el marcador del equipo. Es posible dejar goles sin asignar (por ejemplo, autogoles o anotadores pendientes).
- **Noticias:** contenido y estado de publicación.

Las posiciones se calculan a partir de los partidos finalizados: tres puntos por victoria, uno por empate, orden por puntos, diferencia de goles y goles a favor. Cada división/categoría tiene su propia tabla. Los goleadores se obtienen sumando las anotaciones capturadas. El selector de temporada afecta las páginas públicas; los filtros permiten elegir división y categoría. El calendario permite navegar meses y seleccionar días con partidos.

Los registros relacionados no se pueden eliminar hasta resolver sus dependencias. Cuando sea posible, desactivar un catálogo, equipo o usuario conserva su historial.

## Verificación

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Con el sitio y MySQL en ejecución: `npm run test:integration`. Usa el administrador definido en las variables `SEED_ADMIN_*`, crea registros temporales identificados como `QA-*` y elimina exclusivamente esos registros al terminar. Incluye autenticación, permisos, catálogos, inscripciones, logos, aprobación, resultados y publicación en las páginas públicas. `TEST_BASE_URL` permite cambiar el destino local de la prueba.

## Producción

Se requiere un servidor Node.js con acceso a MySQL. Ejecutar `npm run build` y después `npm start`. Configurar las variables `DB_*` en el servidor. Ejecutar la preparación de la base antes del primer inicio; `SEED_ADMIN_*` solo se usa para ese comando y las pruebas.

El proyecto dejó de exportarse como HTML estático: autenticación, inscripciones y administración requieren el servidor. Utilizar HTTPS en producción, ya que las cookies de sesión tienen `Secure`, `HttpOnly` y `SameSite=Lax`. Las contraseñas se almacenan con scrypt y una sal aleatoria; los tokens de sesión se guardan como hashes, expiran a los siete días y los roles se comprueban de nuevo en cada operación protegida. Se limitan los intentos de acceso y las solicitudes de inscripción por correo.

En Hostinger, si las variables `DB_USER`, `DB_PASSWORD` y `DB_NAME` no están completas en el entorno, el inicio del servidor carga `hbuilds/config/league.env`, fuera de las versiones que se reemplazan en cada despliegue. El archivo debe existir con permisos `600` y nunca subirse a Git. También se puede indicar otro archivo mediante `LEAGUE_ENV_FILE`. Las variables ya definidas en el proceso tienen prioridad. Se requiere Node.js 22 para esta carga de configuración.
