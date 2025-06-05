"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react"

interface Procedure {
  id: string
  name: string
  category: string
  price: number
  cost: number
  profit: number
  margin: number
  quantity: number
  totalRevenue: number
  totalCost: number
  totalProfit: number
}

interface ProceduresListProps {
  procedures: Procedure[]
}

const categoryColors = {
  Preventivo: "bg-green-100 text-green-800",
  Restaurador: "bg-blue-100 text-blue-800",
  Endodontia: "bg-purple-100 text-purple-800",
  Cirurgia: "bg-red-100 text-red-800",
  Estético: "bg-yellow-100 text-yellow-800",
}

export function ProceduresList({ procedures }: ProceduresListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "profit" | "margin" | "quantity">("profit")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredAndSortedProcedures = procedures
    .filter(
      (procedure) =>
        procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        procedure.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleSort = (column: "name" | "profit" | "margin" | "quantity") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const totalRevenue = procedures.reduce((sum, proc) => sum + proc.totalRevenue, 0)
  const totalCost = procedures.reduce((sum, proc) => sum + proc.totalCost, 0)
  const totalProfit = procedures.reduce((sum, proc) => sum + proc.totalProfit, 0)
  const totalQuantity = procedures.reduce((sum, proc) => sum + proc.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Header com busca */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Lista de Procedimentos</CardTitle>
            <Button size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Gerenciar Preços
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar procedimentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-600">Receita Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              R$ {totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-600">Custo Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              R$ {totalProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-600">Lucro Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{totalQuantity}</div>
            <p className="text-xs text-gray-600">Total Realizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de procedimentos */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("name")}>
                  Procedimento {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Custo</TableHead>
                <TableHead className="text-right">Lucro Unit.</TableHead>
                <TableHead className="text-right cursor-pointer hover:bg-gray-50" onClick={() => handleSort("margin")}>
                  Margem {sortBy === "margin" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("quantity")}
                >
                  Qtd {sortBy === "quantity" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="text-right">Receita Total</TableHead>
                <TableHead className="text-right cursor-pointer hover:bg-gray-50" onClick={() => handleSort("profit")}>
                  Lucro Total {sortBy === "profit" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedProcedures.map((procedure) => (
                <TableRow key={procedure.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{procedure.name}</TableCell>
                  <TableCell>
                    <Badge className={categoryColors[procedure.category] || "bg-gray-100 text-gray-800"}>
                      {procedure.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {procedure.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {procedure.cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    R$ {procedure.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {procedure.margin >= 70 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : procedure.margin >= 50 ? (
                        <TrendingUp className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={
                          procedure.margin >= 70
                            ? "text-green-600"
                            : procedure.margin >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                        }
                      >
                        {procedure.margin.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{procedure.quantity}</TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {procedure.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right font-medium text-blue-600">
                    R$ {procedure.totalProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
