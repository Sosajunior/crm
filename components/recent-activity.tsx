"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Calendar, CheckCircle } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "appointment",
      patient: "Maria Silva",
      action: "Agendamento confirmado",
      time: "há 5 min",
      status: "success",
      icon: Calendar,
    },
    {
      id: 2,
      type: "procedure",
      patient: "João Santos",
      action: "Procedimento realizado",
      time: "há 15 min",
      status: "completed",
      icon: CheckCircle,
    },
    {
      id: 3,
      type: "contact",
      patient: "Ana Costa",
      action: "Primeiro contato",
      time: "há 32 min",
      status: "new",
      icon: User,
    },
    {
      id: 4,
      type: "appointment",
      patient: "Carlos Lima",
      action: "Agendamento realizado",
      time: "há 1h",
      status: "pending",
      icon: Calendar,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-900 text-green-300"
      case "completed":
        return "bg-blue-900 text-blue-300"
      case "new":
        return "bg-yellow-900 text-yellow-300"
      case "pending":
        return "bg-gray-700 text-gray-300"
      default:
        return "bg-gray-700 text-gray-300"
    }
  }

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center text-foreground">
          <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="p-2 bg-secondary rounded-full">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{activity.patient}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status === "success" && "Confirmado"}
                    {activity.status === "completed" && "Concluído"}
                    {activity.status === "new" && "Novo"}
                    {activity.status === "pending" && "Pendente"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
