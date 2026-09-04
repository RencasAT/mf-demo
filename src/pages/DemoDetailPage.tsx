import { Link, useParams } from "react-router";

import { DashboardLayout } from "host/layout";
import { useAuth } from "host/auth";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "host/ui";

import { useGetDemoItemQuery } from "../store/demoApi";

/**
 * Ruta anidada (`/demo/detalle/:id`).
 *
 * El host no la conoce: delega el subárbol entero, así que añadir o quitar
 * rutas aquí no obliga a recompilar ni desplegar el host.
 */
export const DemoDetailPage = () => {
  const { id = "" } = useParams();
  const { data: item, isLoading } = useGetDemoItemQuery(id);
  const { user } = useAuth();

  console.log({
    user
  })


  return (
    <DashboardLayout
      breadcrumb={{ current: "Detalle", items: [{ label: "Demo", to: "/demo" }] }}
    >
      <div className="flex flex-col gap-4 p-4">
      User: {user?.name}
        {isLoading && <Skeleton className="h-40 w-full" />}

        {!isLoading && !item && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Registro no encontrado</CardTitle>
              <CardDescription>No existe ningún registro con el id «{id}».</CardDescription>
            </CardHeader>
          </Card>
        )}

        {item && (
          <Card>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>Actualizado el {item.updatedAt}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{item.description}</p>
            </CardContent>
          </Card>
        )}

        <div>
          <Button asChild variant="outline">
            <Link to="/demo">Volver al listado</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
