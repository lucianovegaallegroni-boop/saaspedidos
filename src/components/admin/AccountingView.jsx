import React, { useState, useMemo } from 'react';
import { useRestaurant, PAYMENT_STATUSES, OPERATIONAL_STATUSES } from '../../context/RestaurantContext';
import AdminNavbar from './AdminNavbar';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  CreditCard,
  ShoppingBag,
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Eye,
  Store,
  Smartphone,
  ChevronDown,
  X,
  ArrowUpDown,
  CalendarDays,
  Layers
} from 'lucide-react';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function AccountingView() {
  const { orders } = useRestaurant();

  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL'); // 'ALL' | 'PAID' | 'PENDING' | 'FAILED'
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('ALL'); // 'ALL' | 'YAPPY_TRANSFER' | 'PAY_IN_STORE'
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState('ALL'); // 'ALL' | 'YYYY-MM'
  const [monthSortOrder, setMonthSortOrder] = useState('NEWEST'); // 'NEWEST' (más reciente primero) | 'OLDEST' (más antiguo primero)
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);

  // Extraer periodos ÚNICAMENTE con datos registrados agrupados por Año y Mes
  // Estructura: { years: [2026, 2025...], periodsByYear: { 2026: [{ key: '2026-09', monthName, label, count, revenue }] }, flatPeriods: [...] }
  const periodData = useMemo(() => {
    const periodMap = {};

    orders.forEach((o) => {
      if (o.createdAt) {
        const d = new Date(o.createdAt);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const key = `${y}-${m}`;
        const monthName = MONTH_NAMES[d.getMonth()];
        const label = `${monthName} ${y}`;

        if (!periodMap[key]) {
          periodMap[key] = {
            key,
            year: y,
            monthIndex: d.getMonth(),
            monthName,
            label,
            count: 0,
            paidCount: 0,
            revenue: 0,
            pending: 0
          };
        }

        periodMap[key].count += 1;
        const total = Number(o.total || 0);
        if (o.paymentStatus === 'PAID') {
          periodMap[key].paidCount += 1;
          periodMap[key].revenue += total;
        } else if (o.paymentStatus === 'PENDING') {
          periodMap[key].pending += total;
        }
      }
    });

    const flatPeriods = Object.values(periodMap);
    flatPeriods.sort((a, b) =>
      monthSortOrder === 'NEWEST' ? b.key.localeCompare(a.key) : a.key.localeCompare(b.key)
    );

    // Agrupación por año (solo años con datos)
    const years = Array.from(new Set(flatPeriods.map((p) => p.year))).sort((a, b) =>
      monthSortOrder === 'NEWEST' ? b - a : a - b
    );

    const periodsByYear = {};
    years.forEach((yr) => {
      periodsByYear[yr] = flatPeriods.filter((p) => p.year === yr);
    });

    return { flatPeriods, years, periodsByYear };
  }, [orders, monthSortOrder]);

  // Período activo actualmente seleccionado (si no es 'ALL')
  const currentActivePeriod = useMemo(() => {
    if (selectedPeriodFilter === 'ALL') return null;
    return periodData.flatPeriods.find((p) => p.key === selectedPeriodFilter) || null;
  }, [selectedPeriodFilter, periodData]);

  // Financial Metrics calculations (calculados según el período seleccionado)
  const financialSummary = useMemo(() => {
    let totalGrossSales = 0;
    let totalCollected = 0; // Total recaudado (solo PAID)
    let totalPending = 0; // Total pendiente por cobrar (PENDING)
    let totalYappyCollected = 0;
    let totalInStoreCollected = 0;
    let paidOrdersCount = 0;
    let pendingOrdersCount = 0;
    let totalItemsSold = 0;

    // Conteo por producto: { [productName]: { quantity, revenue } }
    const productSalesMap = {};

    orders.forEach((order) => {
      // Si hay un periodo seleccionado, filtrar
      if (selectedPeriodFilter !== 'ALL' && order.createdAt) {
        const d = new Date(order.createdAt);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        if (`${y}-${m}` !== selectedPeriodFilter) return;
      }

      const orderTotal = Number(order.total || 0);
      totalGrossSales += orderTotal;

      if (order.paymentStatus === 'PAID') {
        totalCollected += orderTotal;
        paidOrdersCount += 1;

        if (order.paymentMethod === 'YAPPY_TRANSFER' || order.paymentMethod === 'ONLINE_CARD') {
          totalYappyCollected += orderTotal;
        } else {
          totalInStoreCollected += orderTotal;
        }

        // Conteo de items vendidos en órdenes pagadas
        if (Array.isArray(order.items)) {
          order.items.forEach((item) => {
            totalItemsSold += (item.quantity || 1);
            const pName = item.name || 'Producto';
            if (!productSalesMap[pName]) {
              productSalesMap[pName] = { quantity: 0, revenue: 0 };
            }
            productSalesMap[pName].quantity += (item.quantity || 1);
            productSalesMap[pName].revenue += ((item.price || 0) * (item.quantity || 1));
          });
        }
      } else if (order.paymentStatus === 'PENDING') {
        totalPending += orderTotal;
        pendingOrdersCount += 1;
      }
    });

    const averageTicket = paidOrdersCount > 0 ? (totalCollected / paidOrdersCount) : 0;

    // Top selling products
    const topProducts = Object.entries(productSalesMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalGrossSales,
      totalCollected,
      totalPending,
      totalYappyCollected,
      totalInStoreCollected,
      paidOrdersCount,
      pendingOrdersCount,
      averageTicket,
      totalItemsSold,
      topProducts
    };
  }, [orders, selectedPeriodFilter]);

  // Filtered and sorted orders list
  const filteredOrders = useMemo(() => {
    let result = orders.filter((order) => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.items && order.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase())));

      // Payment status filter
      const matchesPaymentStatus =
        paymentStatusFilter === 'ALL' || order.paymentStatus === paymentStatusFilter;

      // Payment method filter
      const matchesPaymentMethod =
        paymentMethodFilter === 'ALL' ||
        (paymentMethodFilter === 'YAPPY_TRANSFER'
          ? (order.paymentMethod === 'YAPPY_TRANSFER' || order.paymentMethod === 'ONLINE_CARD')
          : (order.paymentMethod === 'PAY_IN_STORE' || order.paymentMethod === 'CASH_ON_DELIVERY'));

      // Month/Period filter
      let matchesPeriod = true;
      if (selectedPeriodFilter !== 'ALL' && order.createdAt) {
        const d = new Date(order.createdAt);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        matchesPeriod = `${y}-${m}` === selectedPeriodFilter;
      }

      return matchesSearch && matchesPaymentStatus && matchesPaymentMethod && matchesPeriod;
    });

    // Ordenar por fecha / mes
    result.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return monthSortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [orders, searchTerm, paymentStatusFilter, paymentMethodFilter, selectedPeriodFilter, monthSortOrder]);

  // Exportar a Excel (.xls estructurado)
  const handleExportExcel = () => {
    const periodTitle = selectedPeriodFilter !== 'ALL'
      ? (currentActivePeriod?.label || selectedPeriodFilter)
      : 'Historial Completo (Todos los Períodos)';

    const tableRowsHtml = filteredOrders.map((o) => {
      const itemsDetail = (o.items || []).map((i) => `${i.quantity}x ${i.name} ($${((i.price || 0) * (i.quantity || 1)).toFixed(2)})`).join('<br/>');
      const methodLabel = (o.paymentMethod === 'YAPPY_TRANSFER' || o.paymentMethod === 'ONLINE_CARD')
        ? 'Yappy / Online'
        : 'Pagar en Local';
      const statusLabel = o.paymentStatus === 'PAID' ? 'PAGADO' : o.paymentStatus === 'PENDING' ? 'PENDIENTE' : 'FALLIDO';
      const statusColor = o.paymentStatus === 'PAID' ? '#10b981' : o.paymentStatus === 'PENDING' ? '#f59e0b' : '#ef4444';

      return `
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">#${o.id}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${new Date(o.createdAt).toLocaleString('es-PA')}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;"><b>${o.customerName}</b><br/><small style="color: #64748b;">${o.customerPhone || ''}</small></td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${itemsDetail}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">${methodLabel}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: ${statusColor}; font-weight: bold;">${statusLabel}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$${(o.subtotal || 0).toFixed(2)}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; color: #ef4444;">-$${(o.discount || 0).toFixed(2)}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; font-weight: bold; color: #047857; font-size: 13px;">$${(o.total || 0).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Contabilidad Pedidos</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: Arial, sans-serif; }
          .header-title { font-size: 18px; font-weight: bold; color: #0f172a; margin-bottom: 4px; }
          .kpi-table { margin-bottom: 20px; border-collapse: collapse; }
          .kpi-table th { background-color: #f1f5f9; padding: 10px; border: 1px solid #cbd5e1; font-size: 12px; }
          .kpi-table td { padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; font-size: 14px; text-align: center; }
          .main-table { width: 100%; border-collapse: collapse; }
          .main-table th { background-color: #0f172a; color: #ffffff; padding: 10px; border: 1px solid #334155; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header-title">Reporte Financiero y Contable de Pedidos - saasPedidos</div>
        <p style="font-size: 12px; color: #475569;">Período Contable: <b>${periodTitle}</b> | Generado el: ${new Date().toLocaleString('es-PA')}</p>
        
        <table class="kpi-table">
          <tr>
            <th>Total Recaudado (Cobrado)</th>
            <th>Pendiente por Cobrar</th>
            <th>Ventas por Yappy</th>
            <th>Ventas en Local</th>
            <th>Ticket Promedio</th>
            <th>Pedidos Cobrados</th>
          </tr>
          <tr>
            <td style="color: #047857;">$${financialSummary.totalCollected.toFixed(2)}</td>
            <td style="color: #d97706;">$${financialSummary.totalPending.toFixed(2)}</td>
            <td style="color: #0284c7;">$${financialSummary.totalYappyCollected.toFixed(2)}</td>
            <td style="color: #059669;">$${financialSummary.totalInStoreCollected.toFixed(2)}</td>
            <td style="color: #7c3aed;">$${financialSummary.averageTicket.toFixed(2)}</td>
            <td>${financialSummary.paidOrdersCount} de ${filteredOrders.length}</td>
          </tr>
        </table>

        <h3 style="font-size: 14px; margin-bottom: 8px;">Detalle de Pedidos Realizados</h3>
        <table class="main-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Fecha y Hora</th>
              <th>Cliente</th>
              <th>Lo Que Se Pidió (Platos y Cantidades)</th>
              <th>Método de Pago</th>
              <th>Estado de Pago</th>
              <th>Subtotal</th>
              <th>Descuento</th>
              <th>Total Recaudado</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #f8fafc; font-weight: bold;">
              <td colspan="8" style="border: 1px solid #cbd5e1; padding: 10px; text-align: right; font-size: 13px;">TOTAL GENERAL RECAUDADO (COBRADO):</td>
              <td style="border: 1px solid #cbd5e1; padding: 10px; text-align: right; color: #047857; font-size: 14px;">$${financialSummary.totalCollected.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', excelTemplate], {
      type: 'application/vnd.ms-excel;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedPeriod = selectedPeriodFilter !== 'ALL' ? selectedPeriodFilter : 'general';
    link.download = `reporte_contabilidad_${sanitizedPeriod}_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Exportar a CSV (respaldo alternativo ligero)
  const handleExportCSV = () => {
    const headers = ['ID Pedido', 'Fecha', 'Cliente', 'Items Solicitados', 'Método Pago', 'Estado Pago', 'Subtotal ($)', 'Descuento ($)', 'Total Recaudado ($)'];
    const rows = filteredOrders.map((o) => {
      const itemsStr = (o.items || []).map((i) => `${i.quantity}x ${i.name}`).join('; ');
      return [
        o.id,
        new Date(o.createdAt).toLocaleString('es-PA'),
        `"${o.customerName}"`,
        `"${itemsStr}"`,
        o.paymentMethod === 'YAPPY_TRANSFER' ? 'Yappy / Transferencia' : 'Pagar en Local',
        o.paymentStatus === 'PAID' ? 'PAGADO' : o.paymentStatus === 'PENDING' ? 'PENDIENTE' : 'FALLIDO',
        (o.subtotal || 0).toFixed(2),
        (o.discount || 0).toFixed(2),
        (o.total || 0).toFixed(2)
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contabilidad_pedidos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <AdminNavbar />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
                  Panel de Contabilidad & Finanzas
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reportes contables, pedidos hechos, recaudación acumulada y exportación a Excel
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón Principal Exportar a Excel */}
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow-md hover:shadow-emerald-600/25 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar a Excel (.xls)</span>
            </button>

            {/* Exportar CSV */}
            <button
              onClick={handleExportCSV}
              title="Descargar versión CSV simple"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Desglose por Mes: Dropdown Elegante & Selector de Períodos con Datos */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                <span>Desglose por Mes & Período Contable</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {periodData.flatPeriods.length === 0
                  ? 'No hay registros contables aún'
                  : `Mostrando únicamente los ${periodData.flatPeriods.length} período(s) con pedidos registrados`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Botón para ordenar períodos por fecha */}
              <button
                onClick={() => setMonthSortOrder((prev) => (prev === 'NEWEST' ? 'OLDEST' : 'NEWEST'))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Cambiar orden cronológico"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <span>{monthSortOrder === 'NEWEST' ? 'Más recientes primero' : 'Más antiguos primero'}</span>
              </button>
            </div>
          </div>

          {/* Selector Dropdown Principal */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-6 lg:col-span-5 relative">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                Seleccionar Mes / Año de Consulta:
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedPeriodFilter}
                  onChange={(e) => setSelectedPeriodFilter(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer transition-all"
                >
                  <option value="ALL">
                    📊 Todos los Períodos Registrados ({orders.length} pedidos en total)
                  </option>

                  {/* Agrupados por Año, mostrando únicamente los meses y años con datos reales */}
                  {periodData.years.map((year) => (
                    <optgroup key={year} label={`Año Fiscal ${year}`}>
                      {(periodData.periodsByYear[year] || []).map((period) => (
                        <option key={period.key} value={period.key}>
                          {period.monthName} {year} — {period.count} pedido(s) (${period.revenue.toFixed(2)} recaudado)
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Badge de Resumen del Período Seleccionado */}
            <div className="md:col-span-6 lg:col-span-7 flex flex-wrap items-center gap-2 pt-1 md:pt-4">
              {currentActivePeriod ? (
                <div className="flex flex-wrap items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  <span className="text-xs font-black text-emerald-900">
                    Período activo: {currentActivePeriod.label}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs font-bold text-emerald-700">
                    {currentActivePeriod.paidCount} cobrados de {currentActivePeriod.count}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs font-black text-emerald-800">
                    ${currentActivePeriod.revenue.toFixed(2)} recaudado
                  </span>
                  <button
                    onClick={() => setSelectedPeriodFilter('ALL')}
                    title="Quitar filtro de mes y ver todos"
                    className="ml-1 text-emerald-600 hover:text-emerald-900 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600">
                  Mostrando acumulado histórico de todos los períodos con actividad
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KPI Financial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Recaudado (Cobrado) */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Total Recaudado (Cobrado)
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                ${financialSummary.totalCollected.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{financialSummary.paidOrdersCount} pedidos cobrados con éxito</span>
              </p>
            </div>
          </div>

          {/* Card 2: Pendiente por Cobrar */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Pendiente por Cobrar
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-amber-600 tracking-tight">
                ${financialSummary.totalPending.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>{financialSummary.pendingOrdersCount} pedidos por confirmar pago</span>
              </p>
            </div>
          </div>

          {/* Card 3: Desglose por Método */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Cobros por Medio
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1.5 mt-2 text-xs">
              <div className="flex justify-between items-center text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-sky-500" /> Yappy / Online:
                </span>
                <span className="font-bold text-slate-900">${financialSummary.totalYappyCollected.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-emerald-500" /> Pagar en Local:
                </span>
                <span className="font-bold text-slate-900">${financialSummary.totalInStoreCollected.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Ticket Promedio y Platos */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Ticket Promedio
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-purple-700 tracking-tight">
                ${financialSummary.averageTicket.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {financialSummary.totalItemsSold} productos vendidos en total
              </p>
            </div>
          </div>
        </div>

        {/* Top Products Quick Bar */}
        {financialSummary.topProducts.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Platos Más Vendidos y Recaudación</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {financialSummary.topProducts.map((p, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{p.name}</p>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-500">{p.quantity} unid.</span>
                    <span className="text-xs font-black text-emerald-600">${p.revenue.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por ID, cliente o plato..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Select Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {/* Payment Status */}
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="PAID">Solo Pagados</option>
                <option value="PENDING">Solo Pendientes</option>
                <option value="FAILED">Fallidos / Reembolsados</option>
              </select>

              {/* Payment Method */}
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Todos los Métodos</option>
                <option value="YAPPY_TRANSFER">📱 Yappy / Online</option>
                <option value="PAY_IN_STORE">🏪 Pagar en Local</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>Cuadro de Pedidos y Recaudación</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                {filteredOrders.length} pedidos
              </span>
            </h2>

            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              Recaudado en vista: ${filteredOrders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + Number(o.total || 0), 0).toFixed(2)}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Pedido / Fecha</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Lo Que Se Pidió (Platos)</th>
                  <th className="py-3 px-4">Método de Pago</th>
                  <th className="py-3 px-4 text-center">Estado Pago</th>
                  <th className="py-3 px-4 text-right">Monto Recaudado</th>
                  <th className="py-3 px-4 text-center">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No se encontraron pedidos con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isPaid = order.paymentStatus === 'PAID';
                    const isPending = order.paymentStatus === 'PENDING';
                    const isYappy = order.paymentMethod === 'YAPPY_TRANSFER' || order.paymentMethod === 'ONLINE_CARD';

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* ID y Fecha */}
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-slate-900 block">#{order.id}</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('es-PA', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </td>

                        {/* Cliente */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 block">{order.customerName}</span>
                          <span className="text-[11px] text-slate-400 block">{order.customerPhone}</span>
                        </td>

                        {/* Lo que se pidió */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="space-y-1">
                            {(order.items || []).map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px]">
                                <span className="font-medium text-slate-700">
                                  <span className="font-bold text-emerald-700">{item.quantity}x</span> {item.name}
                                </span>
                                <span className="text-slate-400 font-mono ml-2">
                                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Método de Pago */}
                        <td className="py-3.5 px-4">
                          {isYappy ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                              <Smartphone className="w-3 h-3 text-sky-600" />
                              Yappy / Online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Store className="w-3 h-3 text-emerald-600" />
                              Pagar en Local
                            </span>
                          )}
                        </td>

                        {/* Estado Pago */}
                        <td className="py-3.5 px-4 text-center">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              Cobrado
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <Clock className="w-3 h-3" />
                              Por Cobrar
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <AlertCircle className="w-3 h-3" />
                              Fallido
                            </span>
                          )}
                        </td>

                        {/* Monto Recaudado */}
                        <td className="py-3.5 px-4 text-right">
                          <span className={`text-sm font-black font-mono block ${isPaid ? 'text-emerald-700' : 'text-slate-500'}`}>
                            ${(order.total || 0).toFixed(2)}
                          </span>
                          {order.discount > 0 && (
                            <span className="text-[10px] text-rose-500 block">
                              Desc: -${order.discount.toFixed(2)}
                            </span>
                          )}
                        </td>

                        {/* Botón Ver Detalle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedOrderForModal(order)}
                            title="Ver desglose completo del pedido"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Desglose Completo de Orden */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-400">Detalle Financiero</span>
                <h3 className="text-lg font-black text-slate-900">Pedido #{selectedOrderForModal.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                <p className="font-bold text-slate-700">Datos del Cliente</p>
                <p className="text-slate-600">Nombre: {selectedOrderForModal.customerName}</p>
                <p className="text-slate-600">Teléfono: {selectedOrderForModal.customerPhone}</p>
                <p className="text-slate-600">Tipo de Entrega: {selectedOrderForModal.deliveryType === 'TAKEAWAY' ? 'Retiro en Local' : 'Envío a Domicilio'}</p>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-2">Artículos del Pedido:</p>
                <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  {(selectedOrderForModal.items || []).map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between bg-white">
                      <div>
                        <span className="font-bold text-slate-900">{item.quantity}x {item.name}</span>
                        {item.notes && <p className="text-[10px] text-amber-700 italic">Nota: {item.notes}</p>}
                      </div>
                      <span className="font-mono font-bold text-slate-700">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5 border border-slate-200/80">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono">${(selectedOrderForModal.subtotal || 0).toFixed(2)}</span>
                </div>
                {selectedOrderForModal.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Descuento aplicado</span>
                    <span className="font-mono">-${(selectedOrderForModal.discount || 0).toFixed(2)}</span>
                  </div>
                )}
                {selectedOrderForModal.deliveryFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Costo de envío</span>
                    <span className="font-mono">${(selectedOrderForModal.deliveryFee || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Recaudado</span>
                  <span className="text-emerald-600 font-mono">${(selectedOrderForModal.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderForModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
