import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { DashboardLayout } from "host/layout";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "host/ui";

import { useCreateDemoItemMutation } from "../store/demoApi";

/**
 * Ruta anidada (`/demo/nuevo`).
 *
 * Escribe por la API del propio microfrontend, que vive en el store del host
 * desde `register()`: el host no sabe que este endpoint existe, ni hay que
 * recompilarlo para añadirlo.
 */
export const DemoNewPage = () => {
  const navigate = useNavigate();
  const [createDemoItem, { isLoading }] = useCreateDemoItemMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    await createDemoItem({ title: title.trim(), description: description.trim() }).unwrap();
    navigate("/demo");
  };

  return (
    <DashboardLayout
      breadcrumb={{ current: "Nuevo registro", items: [{ label: "Demo", to: "/demo" }] }}
    >
      <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nuevo registro</CardTitle>
            <CardDescription>
              Se guarda con la API de este módulo, inyectada en el store del host.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Título</span>
              <Input
                value={title}
                required
                placeholder="Tercer registro"
                className="max-w-sm"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Descripción</span>
              <Input
                value={description}
                placeholder="Opcional"
                className="max-w-sm"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDescription(e.target.value)
                }
              />
            </label>
          </CardContent>
          <CardFooter className="gap-2">
            <Button type="submit" size="sm" disabled={isLoading || !title.trim()}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/demo">Cancelar</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </DashboardLayout>
  );
};
