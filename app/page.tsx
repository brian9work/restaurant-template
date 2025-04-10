import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Settings, ShoppingBag } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-4xl font-bold text-center">Sistema de Gestión de Restaurante</h1>
        <p className="text-xl text-center text-muted-foreground max-w-2xl">
          Bienvenido al sistema de gestión de restaurante. Seleccione su rol para continuar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-8">
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <ShoppingBag className="h-12 w-12 mb-2" />
              <CardTitle>Cliente</CardTitle>
              <CardDescription>Realizar pedidos y ver estado</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Acceda para realizar pedidos desde el menú y ver el estado de sus órdenes.</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href="/cliente/menu" className="w-full">
                <Button className="w-full">Acceder como Cliente</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <ChefHat className="h-12 w-12 mb-2" />
              <CardTitle>Cocina</CardTitle>
              <CardDescription>Gestionar órdenes</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Vea las órdenes entrantes y actualice su estado durante la preparación.</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href="/cocina/ordenes" className="w-full">
                <Button className="w-full">Acceder como Cocina</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <Settings className="h-12 w-12 mb-2" />
              <CardTitle>Administrador</CardTitle>
              <CardDescription>Gestión completa</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Administre el menú, vea reportes de ventas y gestione el sistema completo.</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href="/admin/dashboard" className="w-full">
                <Button className="w-full">Acceder como Admin</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
