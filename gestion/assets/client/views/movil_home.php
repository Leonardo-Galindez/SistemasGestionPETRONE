<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Remitos – Móvil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <style>
    body { background:#f6f7fb }
    .kpi { border-radius:14px }
    .money { font-variant-numeric: tabular-nums }
  </style>
</head>
<body>
  <!-- NAV -->
  <nav class="navbar navbar-light bg-white shadow-sm sticky-top">
    <div class="container-fluid">
      <span class="navbar-brand fw-semibold">Gestión de Remitos</span>
      <div class="d-flex gap-2">
        <a class="btn btn-outline-secondary btn-sm" href="https://admtpoil.com.ar/gestion/client/views/tablero.html">Tablero</a>
      </div>
    </div>
  </nav>

  <main class="container py-3">
    <!-- FILTROS -->
    <form id="filtros" class="row g-2">
      <div class="col-6">
        <label class="form-label mb-0 small">Estado</label>
        <select id="estado" class="form-select form-select-sm">
          <option value="">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Facturado">Facturado</option>
        </select>
      </div>
      <div class="col-6">
        <label class="form-label mb-0 small">Empresa</label>
        <select id="empresa" class="form-select form-select-sm">
          <option value="">Todas</option>
          <option value="TPOIL">TPOIL</option>
          <option value="ABASTO">ABASTO</option>
          <option value="NEMER">NEMER</option>
          <option value="TRANSPETRONE">TRANSPETRONE</option>
        </select>
      </div>
      <div class="col-12">
        <label class="form-label mb-0 small">Cliente (empresa destino)</label>
        <select id="cliente" class="form-select form-select-sm">
          <option value="">Todos</option>
        </select>
      </div>
      <div class="col-6">
        <label class="form-label mb-0 small">Desde</label>
        <input type="date" id="desde" class="form-control form-control-sm">
      </div>
      <div class="col-6">
        <label class="form-label mb-0 small">Hasta</label>
        <input type="date" id="hasta" class="form-control form-control-sm">
      </div>
      <div class="col-12 d-flex gap-2">
        <button class="btn btn-primary w-100" type="submit"><i class="bi bi-funnel me-1"></i>Filtrar</button>
        <button class="btn btn-outline-secondary w-100" id="limpiar" type="button">Limpiar</button>
      </div>
    </form>

    <!-- KPIs -->
    <div class="row g-2 mt-3">
      <div class="col-12 col-sm-6">
        <div class="card kpi shadow-sm">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <div class="text-muted small">Remitos Pendientes</div>
              <div class="h4 mb-0"><span id="kpiPendCant">—</span></div>
              <div class="text-muted small">Total: <span id="kpiPendTotal" class="money">—</span></div>
            </div>
            <i class="bi bi-hourglass-split fs-1 opacity-50"></i>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="card kpi shadow-sm">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <div class="text-muted small">Remitos Facturados</div>
              <div class="h4 mb-0"><span id="kpiFactCant">—</span></div>
              <div class="text-muted small">Total: <span id="kpiFactTotal" class="money">—</span></div>
            </div>
            <i class="bi bi-receipt fs-1 opacity-50"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLA -->
    <div class="card shadow-sm mt-3">
      <div class="card-body p-2">
        <div class="table-responsive">
          <table class="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>EMPRESA</th>
                <th>CLIENTE</th>
                <th class="text-end">VALOR</th>
              </tr>
            </thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
      </div>
    </div>
  </main>

  <script>
    const API_URL = 'https://admtpoil.com.ar/gestion/server/backend/modules/fetch_movil.php';
    const $ = (s) => document.querySelector(s);
    const fmtMoney = n => Number(n || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    function queryString() {
      const q = new URLSearchParams();
      const estado = $('#estado').value.trim();
      const empresa = $('#empresa').value.trim();
      const cliente = $('#cliente').value.trim();
      const desde = $('#desde').value;
      const hasta = $('#hasta').value;
      if (estado) q.set('estado', estado);
      if (empresa) q.set('empresa', empresa);
      if (cliente) q.set('cliente', cliente);
      if (desde) q.set('desde', desde);
      if (hasta) q.set('hasta', hasta);
      return q.toString();
    }

    async function cargar() {
      const res = await fetch(`${API_URL}?${queryString()}`, { credentials: 'include' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Error');

      // KPIs
      $('#kpiPendCant').textContent = json.kpis.pendientes.cantidad;
      $('#kpiPendTotal').textContent = fmtMoney(json.kpis.pendientes.total);
      $('#kpiFactCant').textContent = json.kpis.facturados.cantidad;
      $('#kpiFactTotal').textContent = fmtMoney(json.kpis.facturados.total);

      // Clientes dependientes de empresa
      const selCli = $('#cliente');
      const current = selCli.value;
      selCli.innerHTML = '<option value="">Todos</option>';
      (json.clientes || []).filter(Boolean).forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        selCli.appendChild(opt);
      });
      if ([...selCli.options].some(o => o.value === current)) selCli.value = current;

      // Tabla
      const tb = document.getElementById('tbody');
      tb.innerHTML = '';
      (json.data || []).forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.empresa || ''}</td>
          <td>${r.empresa_destino || ''}</td>
          <td class="text-end">${fmtMoney(r.valor_total)}</td>
        `;
        tb.appendChild(tr);
      });
    } // <<--- ESTA LLAVE FALTABA

    // Listeners: se registran UNA sola vez
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('filtros').addEventListener('submit', (e) => {
        e.preventDefault();
        cargar().catch(console.error);
      });

      document.getElementById('limpiar').addEventListener('click', () => {
        ['estado', 'empresa', 'cliente', 'desde', 'hasta'].forEach(id => { document.getElementById(id).value = ''; });
        cargar().catch(console.error);
      });

      document.getElementById('empresa').addEventListener('change', () => {
        $('#cliente').value = ''; // reset cliente dependiente
        cargar().catch(console.error);
      });

      // Carga inicial
      cargar().catch(console.error);
    });
  </script>
</body>
</html>
