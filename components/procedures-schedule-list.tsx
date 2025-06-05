"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CheckCircle, Clock, DollarSign, User, Search, MoreHorizontal } from "lucide-react"

interface ProceduresListProps {
  selectedDate: Date
  viewMode: "day" | "week" | "month"
  fullView?: boolean
}

export function ProceduresList({ selectedDate, viewMode, fullView = false }: ProceduresListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock procedures data
  const procedures = [
    {
      id: "1",
      time: "09:00",
      patient: "João Santos",
      procedure: "Limpeza Dental",
      status: "completed",
      duration: 45,
      value: 150,
      cost: 45,
      profit: 105,
      notes: "Procedimento realizado com sucesso",
    },
    {
      id: "2",
      time: "10:30",
      patient: "Ana Costa",
      procedure: "Tratamento de Canal",
      status: "in_progress",
      duration: 90,
      value: 850,
      cost: 280,
      profit: 570,
      notes: "Segunda sessão",
    },
    {
      id: "3",
      time: "14:00",
      patient: "Carlos Lima",
      procedure: "Restauração",
      status: "scheduled",
      duration: 60,
      value: 280,
      cost: 95,
      profit: 185,
      notes: "Restauração em resina",
    },
    {
      id: "4",
      time: "15:30",
      patient: "Lucia Oliveira",
      procedure: "Avaliação Ortodôntica",
      status: "completed",
      duration: 30,
      value: 100,
      cost: 25,
      profit: 75,
      notes: "Primeira avaliação",
    },
    {
      id: "5",
      time: "16:30",
      patient: "Pedro Alves",
      procedure: "Extração",
      status: "cancelled",
      duration: 45,
      value: 200,
      cost: 60,
      profit: 140,
      notes: "Cancelado pelo paciente",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-900 text-green-300"
      case "in_progress":
        return "bg-blue-900 text-blue-300"
      case "scheduled":
        return "bg-yellow-900 text-yellow-300"
      case "cancelled":
        return "bg-red-900 text-red-300"
      default:
        return "bg-gray-700 text-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído"
      case "in_progress":
        return "Em Andamento"
      case "scheduled":
        return "Agendado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "in_progress":
        return <Clock className="w-4 h-4" />
      case "scheduled":
        return <Clock className="w-4 h-4" />
      case "cancelled":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredProcedures = procedures.filter((procedure) => {
    const matchesSearch =
      procedure.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.procedure.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || procedure.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalRevenue = filteredProcedures.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.value, 0)

  const totalProfit = filteredProcedures.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.profit, 0)

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-success-foreground" />
            Procedimentos
            {!fullView && ` - ${selectedDate.toLocaleDateString("pt-BR")}`}
          </CardTitle>
          {fullView && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              Novo Procedimento
            </Button>
          )}
        </div>

        {fullView && (
          <>
            <div className="flex items-center space-x-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar procedimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary border-gray-600 text-foreground placeholder-gray-400"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-secondary border border-gray-600 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="completed">Concluídos</option>
                <option value="in_progress">Em Andamento</option>
                <option value="scheduled">Agendados</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-secondary p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Receita do Período</p>
                    <p className="text-xl font-bold text-green-400">R$ {totalRevenue.toLocaleString("pt-BR")}</p>
                  </div>
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Lucro do Período</p>
                    <p className="text-xl font-bold text-blue-400">R$ {totalProfit.toLocaleString("pt-BR")}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          </>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredProcedures.slice(0, fullView ? undefined : 5).map((procedure) => (
            <div
              key={procedure.id}
              className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{procedure.time}</div>
                  <div className="text-xs text-muted-foreground">{procedure.duration}min</div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{procedure.patient}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(procedure.status)}
                    <span className="text-sm text-muted-foreground">{procedure.procedure}</span>
                  </div>
                  {procedure.status === "completed" && (
                    <div className="flex items-center space-x-2 mt-1">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">
                        R$ {procedure.value} (Lucro: R$ {procedure.profit})
                      </span>
                    </div>
                  )}
                  {procedure.notes && <p className="text-xs text-gray-500 mt-1">{procedure.notes}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(procedure.status)}>{getStatusLabel(procedure.status)}</Badge>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {filteredProcedures.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum procedimento encontrado</p>
            </div>
          )}

          {!fullView && filteredProcedures.length > 5 && (
            <div className="text-center pt-4">
              <Button variant="outline" size="sm" className="border-gray-600 text-muted-foreground hover:bg-gray-700">
                Ver todos os procedimentos
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
