import { prisma } from '../../config/database';

/**
 * Reporte diario: ingresos, cantidad de pedidos, ticket promedio.
 */
export async function getDailyReport(tenantId: string, dateStr?: string) {
  const date = dateStr ? new Date(dateStr) : new Date();
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const orders = await prisma.order.findMany({
    where: {
      tenantId,
      createdAt: { gte: startOfDay, lt: endOfDay },
    },
    select: { totalPrice: true, status: true },
  });

  const totalOrders = orders.length;
  const totalIncome = orders.reduce((sum, o) => sum + Number(o.totalPrice), 0);
  const averageTicket = totalOrders > 0 ? totalIncome / totalOrders : 0;

  const byStatus = {
    RECEIVED: orders.filter((o) => o.status === 'RECEIVED').length,
    WASHING: orders.filter((o) => o.status === 'WASHING').length,
    READY: orders.filter((o) => o.status === 'READY').length,
    DELIVERED: orders.filter((o) => o.status === 'DELIVERED').length,
  };

  return {
    date: startOfDay.toISOString().split('T')[0],
    totalOrders,
    totalIncome: Math.round(totalIncome * 100) / 100,
    averageTicket: Math.round(averageTicket * 100) / 100,
    byStatus,
  };
}

/**
 * Reporte semanal: últimos 7 días con resumen por día.
 */
export async function getWeeklyReport(tenantId: string) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const report = await getDailyReport(tenantId, date.toISOString());
    days.push(report);
  }

  const totalIncome = days.reduce((sum, d) => sum + d.totalIncome, 0);
  const totalOrders = days.reduce((sum, d) => sum + d.totalOrders, 0);

  return {
    days,
    summary: {
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalOrders,
      averageTicket: totalOrders > 0 ? Math.round((totalIncome / totalOrders) * 100) / 100 : 0,
    },
  };
}
