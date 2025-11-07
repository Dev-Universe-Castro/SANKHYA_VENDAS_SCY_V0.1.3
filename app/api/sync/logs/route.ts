
import { NextResponse } from 'next/server';
import { buscarLogsSincronizacao, buscarEstatisticasLogs } from '@/lib/sync-logs-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const action = searchParams.get('action');
    
    if (action === 'stats') {
      const idSistema = searchParams.get('idSistema');
      const dataInicio = searchParams.get('dataInicio');
      const dataFim = searchParams.get('dataFim');
      
      const filter: any = {};
      
      if (idSistema) filter.idSistema = parseInt(idSistema);
      if (dataInicio) filter.dataInicio = new Date(dataInicio);
      if (dataFim) filter.dataFim = new Date(dataFim);
      
      const stats = await buscarEstatisticasLogs(filter);
      return NextResponse.json(stats);
    }
    
    // Buscar logs com filtros
    const idSistema = searchParams.get('idSistema');
    const tabela = searchParams.get('tabela');
    const status = searchParams.get('status');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const filter: any = {};
    
    if (idSistema) filter.idSistema = parseInt(idSistema);
    if (tabela) filter.tabela = tabela;
    if (status) filter.status = status;
    if (dataInicio) filter.dataInicio = new Date(dataInicio);
    if (dataFim) filter.dataFim = new Date(dataFim);

    const resultado = await buscarLogsSincronizacao(filter, limit, offset);
    
    return NextResponse.json(resultado);
  } catch (error: any) {
    console.error('❌ Erro ao buscar logs:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar logs de sincronização' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
