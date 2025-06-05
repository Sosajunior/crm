"use client"

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Calculator, Download, Plus, Edit } from "lucide-react"
import { ProceduresList } from "@/components/procedures-list" // Lista de catálogo de procedimentos
import { RevenueChart } from "@/components/revenue-chart"
import { ProfitabilityChart } from "@/components/profitability-chart"

// Reutilizar MetricValues de app/page.tsx ou de um types/index.ts
interface MetricValues {
  faturamento: number;
  gastos: number;
  lucro: number;
  procedimentosRealizados: number;
  // ... outros campos
}

// Interface para itens do catálogo de procedimentos
export interface ProcedureCatalogItem {
  id: string;
  name: string;
  category: string;
  defaultPrice: number; // Renomeado de price
  defaultCost: number;  // Renomeado de cost
  profit?: number; // Calculado: defaultPrice - defaultCost
  margin?: number; // Calculado: (profit / defaultPrice) * 100
  // Campos para ProfitabilityChart (podem ser agregados pela API ou calculados no frontend)
  quantity?: number;
  totalRevenue?: number;
  totalCost?: number;
  totalProfit?: number;
}


interface FinancialDashboardProps {
  period: string;
  metrics: MetricValues | null; // Pode ser nulo enquanto carrega
}

export function FinancialDashboard({ period, metrics: initialMetrics }: FinancialDashboardProps) {
  const [activeTab, setActiveTab] = useState("procedures");
  const [procedureCatalog, setProcedureCatalog] = useState<ProcedureCatalogItem[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

  // Fetch Procedure Catalog
  const fetchProcedureCatalog = useCallback(async () => {
    setIsLoadingCatalog(true);
    try {
      const response = await fetch('/api/procedures/catalog');
      if (!response.ok) throw new Error('Failed to fetch procedure catalog');
      const data: ProcedureCatalogItem[] = await response.json();
      // Calcular profit e margin para cada item do catálogo
      const catalogWithCalculations = data.map(item => {
        const profit = item.defaultPrice - (item.defaultCost || 0);
        const margin = item.defaultPrice > 0 ? (profit / item.defaultPrice) * 100 : 0;
        return { ...item, profit, margin };
      });
      setProcedureCatalog(catalogWithCalculations);
    } catch (error) {
      console.error("Error fetching procedure catalog:", error);
      setProcedureCatalog([]);
    } finally {
      setIsLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'procedures' || activeTab === 'profitability') {
        fetchProcedureCatalog();
    }
    // Se RevenueChart precisar de dados específicos, buscar aqui também
  }, [activeTab, fetchProcedureCatalog]);


  if (!initialMetrics) {
    return <div className="flex justify-center items-center h-64"><p>Carregando dados financeiros...</p></div>;
  }

  const marginPercentage = initialMetrics.faturamento > 0 ? ((initialMetrics.lucro / initialMetrics.faturamento) * 100).toFixed(1) : "0.0";
  const averageTicket = initialMetrics.procedimentosRealizados > 0 ? (initialMetrics.faturamento / initialMetrics.procedimentosRealizados) : 0;
  const averageCost = initialMetrics.procedimentosRealizados > 0 ? (initialMetrics.gastos / initialMetrics.procedimentosRealizados) : 0;

  // Adaptação para ProfitabilityChart: Precisamos de dados agregados de `procedures_performed`
  // Isso idealmente viria de um endpoint específico ou seria calculado. Por ora, usamos o catálogo.
  // Para uma análise real de lucratividade, você agregaria dados de `procedures_performed`
  const profitabilityChartData = procedureCatalog.map(pc => ({
      ...pc,
      // Simular quantity e totais se não vierem da API /api/procedures/catalog
      // Idealmente, a API /api/procedures/performed?groupBy=catalog_id&period=... forneceria isso
      quantity: Math.floor(Math.random() * 30) + 1, // Mock
      get totalRevenue() { return this.defaultPrice * this.quantity; },
      get totalCost() { return (this.defaultCost || 0) * this.quantity; },
      get totalProfit() { return (this.defaultPrice - (this.defaultCost || 0)) * this.quantity; },
  }));


  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Financeiro</h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Análise de faturamento, custos e lucratividade ({period === 'today' ? 'Hoje' : period === 'week' ? 'Esta Semana' : 'Este Mês'}).</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 border-input text-foreground hover:bg-accent">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Exportar
          </Button>
          {/* <Button size="sm" className="h-9 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Nova Transação
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="card-hover bg-gradient-to-br from-success-muted via-card to-card border-success-foreground/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-foreground">
              R$ {initialMetrics.faturamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{initialMetrics.procedimentosRealizados} procedimentos</p>
          </CardContent>
        </Card>
        {/* Outros cards de resumo ... */}
         <Card className="card-hover bg-gradient-to-br from-destructive/10 via-card to-card border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Custos Totais</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {initialMetrics.gastos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {initialMetrics.faturamento > 0 ? ((initialMetrics.gastos / initialMetrics.faturamento) * 100).toFixed(1) : 0}% do faturamento
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Lucro Líquido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {initialMetrics.lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Margem de {marginPercentage}%</p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-info-muted via-card to-card border-info-foreground/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Ticket Médio</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info-foreground">
              R$ {averageTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Custo médio: R$ {averageCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>


      <Tabs defaultValue="procedures" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="procedures" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Procedimentos</TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Receita</TabsTrigger>
          <TabsTrigger value="profitability" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Lucratividade</TabsTrigger>
        </TabsList>

        <TabsContent value="procedures">
          {isLoadingCatalog ? <p>Carregando catálogo de procedimentos...</p> : <ProceduresList procedures={procedureCatalog} />}
        </TabsContent>
        <TabsContent value="revenue">
            <Card>
                <CardHeader>
                    <CardTitle>Evolução da Receita</CardTitle>
                    <CardDescription>Faturamento ao longo do período de {period}</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <RevenueChart period={period} />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="profitability">
            {isLoadingCatalog ? <p>Carregando dados de lucratividade...</p> : <ProfitabilityChart procedures={profitabilityChartData} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}