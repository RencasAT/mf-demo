import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Boxes } from "lucide-react";
import { useAuth } from "host/auth";
import { DashboardLayout } from "host/layout";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Separator,
  Skeleton,
} from "host/ui";

import { demoActions, selectDemoState } from "../store/demoSlice";
import { useGetDemoItemsQuery } from "../store/demoApi";

/**
 * Punto de entrada del módulo (`/demo`).
 *
 * Es el esqueleto sobre el que se construye: layout y componentes vienen del
 * host por federación, el estado y los datos son de este repositorio.
 */
export const DemoHomePage = () => {
  const dispatch = useDispatch();
  const { search } = useSelector(selectDemoState);
  const { data: items = [], isLoading } = useGetDemoItemsQuery();
  const { user } = useAuth();

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <DashboardLayout breadcrumb={{ current: "Demo", items: [] }}>
      <div className="flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Boxes size={18} />
              Demo
              <Badge variant="secondary">microfrontend</Badge>
            </CardTitle>
            <CardDescription>
              Este módulo vive en su propio repositorio y se despliega solo. El host únicamente
              reserva <code>/demo/*</code> y carga este <code>remoteEntry.js</code> en runtime.
            </CardDescription>
            <CardDescription>
              User: {user?.fullname} - email: {user?.email}
            </CardDescription>
            <Button asChild size="sm" className="w-fit">
              <Link to="nuevo">Nuevo registro</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Input
              value={search}
              placeholder="Buscar..."
              className="max-w-sm"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(demoActions.setSearch(e.target.value))
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Registros</CardTitle>
            <CardDescription>{filtered.length} de {items.length}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {isLoading && <Skeleton className="h-20 w-full" />}

            {!isLoading &&
              filtered.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className="text-muted-foreground text-xs">{item.updatedAt}</span>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`detalle/${item.id}`}>Ver detalle</Link>
                    </Button>
                  </div>
                </div>
              ))}

            {!isLoading && filtered.length === 0 && (
              <p className="text-muted-foreground text-sm">Sin resultados.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
