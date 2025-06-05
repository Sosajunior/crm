"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, TrendingUp, DollarSign, Calendar as CalendarIcon, User, CheckCircle, Clock, AlertCircle, Info, FilterX } from "lucide-react"

interface ProcedureRecord {
  id: string;
  date: string;
  patientName: string;
  procedureName: string;
  category: string;
  status: "completed" | "pending" | "cancelled" | "in_