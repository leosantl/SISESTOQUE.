interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  quantity: number;
  min_quantity: number;
  expire_date: string | null;
  status: string;
  created_at: string;
}

interface Movement {
  id: string;
  movement_type: string;
  quantity: number;
  reason: string | null;
  created_at: string;
  products: {
    name: string;
    code: string;
  };
}

export function exportToCSV(data: any[], filename: string, headers: string[]) {
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = getNestedValue(row, header);
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export function exportProducts(products: Product[]) {
  const headers = [
    'name',
    'code', 
    'price',
    'quantity',
    'min_quantity',
    'expire_date',
    'status',
    'created_at'
  ];

  const csvHeaders = [
    'Nome',
    'Código',
    'Preço',
    'Quantidade',
    'Estoque Mínimo',
    'Data de Validade',
    'Status',
    'Data de Cadastro'
  ];

  // Format data for export
  const formattedData = products.map(product => ({
    name: product.name,
    code: product.code,
    price: product.price.toFixed(2).replace('.', ','),
    quantity: product.quantity,
    min_quantity: product.min_quantity,
    expire_date: product.expire_date ? new Date(product.expire_date).toLocaleDateString('pt-BR') : 'Não informado',
    status: product.status === 'active' ? 'Ativo' : 'Inativo',
    created_at: new Date(product.created_at).toLocaleDateString('pt-BR')
  }));

  exportToCSV(formattedData, 'produtos_sisestoque', csvHeaders);
}

export function exportMovements(movements: Movement[]) {
  const headers = [
    'products.name',
    'products.code',
    'movement_type',
    'quantity',
    'reason',
    'created_at'
  ];

  const csvHeaders = [
    'Produto',
    'Código',
    'Tipo',
    'Quantidade',
    'Motivo',
    'Data'
  ];

  // Format data for export
  const formattedData = movements.map(movement => ({
    'products.name': movement.products.name,
    'products.code': movement.products.code,
    movement_type: movement.movement_type === 'in' ? 'Entrada' : 'Saída',
    quantity: movement.quantity,
    reason: movement.reason || 'Não informado',
    created_at: new Date(movement.created_at).toLocaleString('pt-BR')
  }));

  exportToCSV(formattedData, 'movimentacoes_sisestoque', csvHeaders);
}

export function exportLowStockReport(products: Product[]) {
  const lowStockProducts = products.filter(p => p.quantity <= p.min_quantity);
  
  const formattedData = lowStockProducts.map(product => ({
    name: product.name,
    code: product.code,
    quantity: product.quantity,
    min_quantity: product.min_quantity,
    deficit: product.min_quantity - product.quantity,
    price: product.price.toFixed(2).replace('.', ','),
    total_value: (product.price * product.quantity).toFixed(2).replace('.', ',')
  }));

  const csvHeaders = [
    'Nome',
    'Código', 
    'Quantidade Atual',
    'Estoque Mínimo',
    'Déficit',
    'Preço Unitário',
    'Valor Total'
  ];

  exportToCSV(formattedData, 'relatorio_estoque_baixo', csvHeaders);
}

export function exportExpiringReport(products: Product[]) {
  const now = new Date();
  const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const expiringProducts = products.filter(p => {
    if (!p.expire_date) return false;
    const expireDate = new Date(p.expire_date);
    return expireDate <= next30Days && expireDate >= now;
  });

  const formattedData = expiringProducts.map(product => {
    const expireDate = new Date(product.expire_date!);
    const daysToExpire = Math.ceil((expireDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      name: product.name,
      code: product.code,
      quantity: product.quantity,
      expire_date: expireDate.toLocaleDateString('pt-BR'),
      days_to_expire: daysToExpire,
      price: product.price.toFixed(2).replace('.', ','),
      total_value: (product.price * product.quantity).toFixed(2).replace('.', ',')
    };
  });

  const csvHeaders = [
    'Nome',
    'Código',
    'Quantidade',
    'Data de Validade',
    'Dias para Vencer',
    'Preço Unitário',
    'Valor Total'
  ];

  exportToCSV(formattedData, 'relatorio_produtos_vencendo', csvHeaders);
}