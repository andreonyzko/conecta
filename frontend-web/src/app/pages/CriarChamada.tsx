import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Trash2, X, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { ItemChamada } from '../types';

const inputClass =
  'w-full bg-[#1D2226] border border-[#2F3336] text-white rounded-xl px-4 py-3 focus:border-[#149D7F] focus:outline-none placeholder:text-[#B0B3B8]';
const labelClass = 'block text-[#B0B3B8] mb-1.5';

interface ItemForm extends Omit<ItemChamada, 'id'> {}

const emptyItem: ItemForm = {
  produto: '',
  categoria: '',
  quantidade: 0,
  unidade: 'kg',
  frequencia: 'Semanal',
  precoReferencia: 0,
};

function ItemModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: ItemChamada;
  onSave: (item: ItemChamada) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ItemForm>(
    initial ? { ...initial } : { ...emptyItem }
  );

  const handleSave = () => {
    if (!form.produto.trim()) { toast.error('Informe o produto.'); return; }
    if (form.quantidade <= 0) { toast.error('Quantidade deve ser maior que zero.'); return; }
    onSave({ ...form, id: initial?.id || `item-${Date.now()}` });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/60">
      <div className="w-full bg-[#1D2226] rounded-t-2xl border-t border-[#2F3336] flex flex-col max-h-[80%]">
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#2F3336] flex-shrink-0">
          <h3 className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
            {initial ? 'Editar Item' : 'Novo Item'}
          </h3>
          <button onClick={onClose} className="text-[#B0B3B8] p-1 active:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto agro-scroll px-4 py-4 flex-1 flex flex-col gap-4">
          <div>
            <label className={labelClass} style={{ fontSize: '14px' }}>Produto</label>
            <input className={inputClass} style={{ fontSize: '14px' }} placeholder="Ex: Alface" value={form.produto} onChange={(e) => setForm((f) => ({ ...f, produto: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass} style={{ fontSize: '14px' }}>Categoria</label>
            <input className={inputClass} style={{ fontSize: '14px' }} placeholder="Ex: Hortaliças" value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass} style={{ fontSize: '14px' }}>Quantidade</label>
              <input type="number" className={inputClass} style={{ fontSize: '14px' }} placeholder="100" value={form.quantidade || ''} onChange={(e) => setForm((f) => ({ ...f, quantidade: Number(e.target.value) }))} />
            </div>
            <div className="w-24">
              <label className={labelClass} style={{ fontSize: '14px' }}>Unidade</label>
              <select className={inputClass} style={{ fontSize: '14px' }} value={form.unidade} onChange={(e) => setForm((f) => ({ ...f, unidade: e.target.value }))}>
                <option value="kg">kg</option>
                <option value="un">un</option>
                <option value="cx">cx</option>
                <option value="lt">lt</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass} style={{ fontSize: '14px' }}>Frequência de entrega</label>
            <select className={inputClass} style={{ fontSize: '14px' }} value={form.frequencia} onChange={(e) => setForm((f) => ({ ...f, frequencia: e.target.value }))}>
              <option>Semanal</option>
              <option>Quinzenal</option>
              <option>Mensal</option>
              <option>Bimestral</option>
            </select>
          </div>
          <div>
            <label className={labelClass} style={{ fontSize: '14px' }}>Preço de referência (R$/unidade)</label>
            <input type="number" step="0.01" className={inputClass} style={{ fontSize: '14px' }} placeholder="4.50" value={form.precoReferencia || ''} onChange={(e) => setForm((f) => ({ ...f, precoReferencia: Number(e.target.value) }))} />
          </div>
        </div>

        <div className="px-4 py-4 border-t border-[#2F3336] flex-shrink-0">
          <button onClick={handleSave} className="w-full bg-[#149D7F] text-white rounded-full py-3.5 active:opacity-80" style={{ fontSize: '15px', fontWeight: 600 }}>
            {initial ? 'Salvar' : 'Adicionar item'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CriarChamada() {
  const navigate = useNavigate();
  const { currentUserId, addChamada } = useAppContext();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [itens, setItens] = useState<ItemChamada[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemChamada | undefined>();

  const handleAddItem = (item: ItemChamada) => {
    if (editingItem) {
      setItens((prev) => prev.map((x) => (x.id === item.id ? item : x)));
    } else {
      setItens((prev) => [...prev, item]);
    }
    setShowModal(false);
    setEditingItem(undefined);
  };

  const handlePublicar = () => {
    if (!titulo.trim()) { toast.error('Informe o título da chamada.'); return; }
    if (!dataInicio || !dataFim) { toast.error('Informe as datas da chamada.'); return; }
    if (itens.length === 0) { toast.error('Adicione ao menos um item.'); return; }

    addChamada({
      titulo,
      descricao,
      dataInicio,
      dataFim,
      itens,
      instituicaoId: currentUserId,
      status: 'ativa',
    });

    toast.success('Chamada publicada com sucesso!');
    navigate('/chamadas');
  };

  return (
    <div className="relative flex-1 flex flex-col bg-[#121212] min-h-0">
      {/* Header */}
      <div className="bg-[#1D2226] border-b border-[#2F3336] px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full active:bg-[#2F3336] text-white">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-white flex-1" style={{ fontSize: '16px', fontWeight: 600 }}>Nova Chamada Pública</h2>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto agro-scroll px-4 pt-5 pb-4 flex flex-col gap-5">
        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>Título *</label>
          <input className={inputClass} style={{ fontSize: '14px' }} value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Chamada Pública nº 01/2026" />
        </div>

        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>Descrição</label>
          <textarea
            className={`${inputClass} resize-none`}
            style={{ fontSize: '14px', minHeight: '100px' }}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva os objetivos e requisitos desta chamada..."
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClass} style={{ fontSize: '14px' }}>Data de início *</label>
            <input
              type="date"
              className={`${inputClass} [color-scheme:dark]`}
              style={{ fontSize: '14px' }}
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className={labelClass} style={{ fontSize: '14px' }}>Data de encerramento *</label>
            <input
              type="date"
              className={`${inputClass} [color-scheme:dark]`}
              style={{ fontSize: '14px' }}
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-[#149D7F]" />
              <span className="text-white" style={{ fontSize: '15px', fontWeight: 600 }}>
                Itens da Chamada
              </span>
            </div>
            <button
              onClick={() => { setEditingItem(undefined); setShowModal(true); }}
              className="flex items-center gap-1.5 text-[#149D7F]"
              style={{ fontSize: '13px', fontWeight: 600 }}
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>

          {itens.length === 0 ? (
            <div className="border-2 border-dashed border-[#2F3336] rounded-2xl p-6 text-center">
              <Package size={24} className="text-[#2F3336] mx-auto mb-2" />
              <p className="text-[#B0B3B8]" style={{ fontSize: '13px' }}>
                Adicione os itens que você precisa adquirir
              </p>
            </div>
          ) : (
            itens.map((item) => (
              <div key={item.id} className="bg-[#1D2226] border border-[#2F3336] rounded-xl p-3.5 mb-2 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>{item.produto}</p>
                  <p className="text-[#B0B3B8]" style={{ fontSize: '12px' }}>
                    {item.quantidade} {item.unidade} · {item.frequencia} · Ref. R$ {item.precoReferencia.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingItem(item); setShowModal(true); }} className="text-[#149D7F] p-1.5 active:opacity-60">
                    <Plus size={15} />
                  </button>
                  <button onClick={() => setItens((prev) => prev.filter((x) => x.id !== item.id))} className="text-[#E74C3C] p-1.5 active:opacity-60">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex-shrink-0 px-4 pb-5 pt-3 border-t border-[#2F3336] bg-[#121212]">
        <button onClick={handlePublicar} className="w-full bg-[#149D7F] text-white rounded-full py-3.5 active:opacity-80" style={{ fontSize: '15px', fontWeight: 600 }}>
          Publicar Chamada
        </button>
      </div>

      {showModal && (
        <ItemModal
          initial={editingItem}
          onSave={handleAddItem}
          onClose={() => { setShowModal(false); setEditingItem(undefined); }}
        />
      )}
    </div>
  );
}