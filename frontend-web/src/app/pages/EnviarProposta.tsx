import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Plus, Trash2, X, Truck, Package, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { ItemProposta } from '../types';

const inputClass =
  'w-full bg-[#1D2226] border border-[#2F3336] text-white rounded-xl px-4 py-3 focus:border-[#149D7F] focus:outline-none placeholder:text-[#B0B3B8]';
const labelClass = 'block text-[#B0B3B8] mb-1.5';

interface ItemPropostaForm extends Omit<ItemProposta, 'id' | 'total'> {}

const emptyItem: ItemPropostaForm = {
  produto: '',
  quantidade: 0,
  unidade: 'kg',
  precoPorUnidade: 0,
};

function ItemModal({
  initial,
  onSave,
  onClose,
  chamadaItens,
}: {
  initial?: ItemProposta;
  onSave: (item: ItemProposta) => void;
  onClose: () => void;
  chamadaItens: Array<{ produto: string; unidade: string; categoria: string }>;
}) {
  const categorias = Array.from(new Set(chamadaItens.map((item) => item.categoria)));
  const initialCategoria =
    chamadaItens.find((item) => item.produto === initial?.produto)?.categoria || '';
  const [categoria, setCategoria] = useState(initialCategoria);
  const [selectedProduto, setSelectedProduto] = useState(initial?.produto || '');
  const [form, setForm] = useState<ItemPropostaForm>(
    initial
      ? { produto: initial.produto, quantidade: initial.quantidade, unidade: initial.unidade, precoPorUnidade: initial.precoPorUnidade }
      : { ...emptyItem }
  );
  const produtosFiltrados = categoria
    ? chamadaItens.filter((item) => item.categoria === categoria)
    : chamadaItens;

  const total = form.quantidade * form.precoPorUnidade;

  const handleSave = () => {
    if (!form.produto.trim()) { toast.error('Informe o produto.'); return; }
    if (form.quantidade <= 0) { toast.error('Quantidade deve ser maior que zero.'); return; }
    if (form.precoPorUnidade <= 0) { toast.error('Preço deve ser maior que zero.'); return; }
    onSave({
      id: initial?.id || `pi-${Date.now()}`,
      ...form,
      total,
    });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/60">
      <div className="w-full bg-[#1D2226] rounded-t-2xl border-t border-[#2F3336] flex flex-col max-h-[75%]">
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#2F3336] flex-shrink-0">
          <h3 className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
            {initial ? 'Editar Item' : 'Novo Item da Proposta'}
          </h3>
          <button onClick={onClose} className="text-[#B0B3B8] p-1 active:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto agro-scroll px-4 py-4 flex-1 flex flex-col gap-4">
          <div>
            <label className={labelClass} style={{ fontSize: '14px' }}>Categoria</label>
            <select
              className={inputClass}
              style={{ fontSize: '14px' }}
              value={categoria}
              onChange={(e) => {
                const nextCategoria = e.target.value;
                setCategoria(nextCategoria);
                setSelectedProduto('');
                setForm((f) => ({ ...f, produto: '' }));
              }}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} style={{ fontSize: '14px' }}>Produto</label>
            {chamadaItens.length > 0 ? (
              <select
                className={inputClass}
                style={{ fontSize: '14px' }}
                value={selectedProduto}
                disabled={!categoria}
                onChange={(e) => {
                  const found = produtosFiltrados.find((i) => i.produto === e.target.value);
                  setSelectedProduto(e.target.value);
                  setForm((f) => ({
                    ...f,
                    produto: e.target.value,
                    unidade: found?.unidade || f.unidade,
                  }));
                }}
              >
                <option value="">Selecione um produto</option>
                {produtosFiltrados.map((i) => (
                  <option key={i.produto} value={i.produto}>{i.produto}</option>
                ))}
              </select>
            ) : null}
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
            <label className={labelClass} style={{ fontSize: '14px' }}>Preço por unidade (R$)</label>
            <input type="number" step="0.01" className={inputClass} style={{ fontSize: '14px' }} placeholder="4.50" value={form.precoPorUnidade || ''} onChange={(e) => setForm((f) => ({ ...f, precoPorUnidade: Number(e.target.value) }))} />
          </div>

          {total > 0 && (
            <div className="bg-[#149D7F]/10 border border-[#149D7F]/30 rounded-xl p-3 text-center">
              <p className="text-[#149D7F]" style={{ fontSize: '13px' }}>Subtotal</p>
              <p className="text-[#149D7F]" style={{ fontSize: '18px', fontWeight: 700 }}>
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
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

export function EnviarProposta() {
  const { chamadaId } = useParams<{ chamadaId: string }>();
  const navigate = useNavigate();
  const {
    getChamada,
    getInstituicao,
    addProposta,
    currentUserId,
    propostas,
    getItensDisponiveisForChamada,
  } = useAppContext();

  const chamada = getChamada(chamadaId!);
  const inst = chamada ? getInstituicao(chamada.instituicaoId) : null;

  const [itens, setItens] = useState<ItemProposta[]>([]);
  const [realizaEntrega, setRealizaEntrega] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemProposta | undefined>();

  if (!chamada) {
    return (
      <div className="flex-1 flex flex-col bg-[#121212] items-center justify-center">
        <p className="text-[#B0B3B8]">Chamada não encontrada</p>
        <button onClick={() => navigate(-1)} className="text-[#149D7F] mt-3" style={{ fontSize: '14px' }}>Voltar</button>
      </div>
    );
  }

  const jaEnviou = propostas.some((p) => p.chamadaId === chamadaId && p.agricultorId === currentUserId);
  const itensDisponiveis = getItensDisponiveisForChamada(chamadaId!);
  const valorTotal = itens.reduce((sum, i) => sum + i.total, 0);

  const handleAddItem = (item: ItemProposta) => {
    if (!itensDisponiveis.some((disponivel) => disponivel.produto === item.produto)) {
      toast.error('Esse item já foi atendido por outra proposta aceita.');
      return;
    }

    if (editingItem) {
      setItens((prev) => prev.map((x) => (x.id === item.id ? item : x)));
    } else {
      setItens((prev) => [...prev, item]);
    }
    setShowModal(false);
    setEditingItem(undefined);
  };

  const handleEnviar = () => {
    if (jaEnviou) { toast.error('Você já enviou uma proposta para esta chamada.'); return; }
    if (chamada.status !== 'ativa') { toast.error('Esta chamada não está mais recebendo propostas.'); return; }
    if (itensDisponiveis.length === 0) { toast.error('Todos os itens desta chamada já foram atendidos.'); return; }
    if (itens.length === 0) { toast.error('Adicione ao menos um item à proposta.'); return; }
    if (itens.some((item) => !itensDisponiveis.some((disponivel) => disponivel.produto === item.produto))) {
      toast.error('Há itens na proposta que já foram atendidos por outros agricultores.');
      return;
    }

    addProposta({
      chamadaId: chamadaId!,
      agricultorId: currentUserId,
      itens,
      realizaEntrega,
      mensagem,
      valorTotal,
      status: 'pendente',
    });

    toast.success('Proposta enviada com sucesso!');
    navigate('/propostas');
  };

  return (
    <div className="relative flex-1 flex flex-col bg-[#121212] min-h-0">
      {/* Header */}
      <div className="bg-[#1D2226] border-b border-[#2F3336] px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full active:bg-[#2F3336] text-white flex-shrink-0">
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>Enviar Proposta</h2>
        </div>
        <div className="pl-12">
          <p className="text-[#B0B3B8] line-clamp-1" style={{ fontSize: '12px' }}>{chamada.titulo}</p>
          {inst && <p className="text-[#149D7F]" style={{ fontSize: '12px' }}>{inst.nome}</p>}
        </div>
      </div>

      {/* Warning if already sent */}
      {jaEnviou && (
        <div className="mx-4 mt-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3.5 flex items-center gap-2">
          <span className="text-yellow-400" style={{ fontSize: '13px' }}>⚠️ Você já enviou uma proposta para esta chamada.</span>
        </div>
      )}

      {!jaEnviou && itensDisponiveis.length === 0 && (
        <div className="mx-4 mt-4 bg-[#E74C3C]/10 border border-[#E74C3C]/30 rounded-xl p-3.5">
          <span className="text-[#E74C3C]" style={{ fontSize: '13px' }}>
            Todos os itens desta chamada já foram atendidos por propostas aceitas.
          </span>
        </div>
      )}

      {/* Form */}
      <div className="flex-1 overflow-y-auto agro-scroll px-4 pt-4 pb-4 flex flex-col gap-5">
        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-[#149D7F]" />
              <span className="text-white" style={{ fontSize: '15px', fontWeight: 600 }}>Itens da Proposta</span>
            </div>
            <button
              onClick={() => { setEditingItem(undefined); setShowModal(true); }}
              disabled={itensDisponiveis.length === 0}
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
                Adicione os itens que você pode fornecer
              </p>
            </div>
          ) : (
            <>
              {itens.map((item) => (
                <div key={item.id} className="bg-[#1D2226] border border-[#2F3336] rounded-xl p-3.5 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>{item.produto}</p>
                    <p className="text-[#149D7F]" style={{ fontSize: '14px', fontWeight: 700 }}>
                      R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[#B0B3B8]" style={{ fontSize: '12px' }}>
                      {item.quantidade} {item.unidade} × R$ {item.precoPorUnidade.toFixed(2).replace('.', ',')}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(item); setShowModal(true); }} className="text-[#149D7F] p-1 active:opacity-60">
                        <Plus size={14} />
                      </button>
                      <button onClick={() => setItens((prev) => prev.filter((x) => x.id !== item.id))} className="text-[#E74C3C] p-1 active:opacity-60">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Total */}
              <div className="bg-[#149D7F]/10 border border-[#149D7F]/30 rounded-xl p-3.5 flex items-center justify-between">
                <span className="text-[#149D7F]" style={{ fontSize: '14px', fontWeight: 600 }}>Valor Total</span>
                <span className="text-[#149D7F]" style={{ fontSize: '18px', fontWeight: 700 }}>
                  R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Delivery */}
        <div className="bg-[#1D2226] border border-[#2F3336] rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRealizaEntrega(!realizaEntrega)}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${realizaEntrega ? 'bg-[#149D7F] border-[#149D7F]' : 'border-[#2F3336]'}`}
            >
              {realizaEntrega && <span className="text-white text-xs">✓</span>}
            </button>
            <div className="flex items-center gap-2">
              <Truck size={16} className={realizaEntrega ? 'text-[#149D7F]' : 'text-[#B0B3B8]'} />
              <div>
                <p className="text-white" style={{ fontSize: '14px' }}>Realizo entrega própria</p>
                <p className="text-[#B0B3B8]" style={{ fontSize: '12px' }}>Sem custo adicional para a instituição</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>Mensagem (opcional)</label>
          <textarea
            className={`${inputClass} resize-none`}
            style={{ fontSize: '14px', minHeight: '90px' }}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Informações adicionais sobre sua produção, certificações, disponibilidade de entrega..."
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex-shrink-0 px-4 pb-5 pt-3 border-t border-[#2F3336] bg-[#121212]">
        <button
          onClick={handleEnviar}
          disabled={jaEnviou}
          className="w-full bg-[#149D7F] text-white rounded-full py-3.5 flex items-center justify-center gap-2 active:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontSize: '15px', fontWeight: 600 }}
        >
          <Send size={16} /> Enviar Proposta
        </button>
      </div>

      {showModal && (
        <ItemModal
          initial={editingItem}
          onSave={handleAddItem}
          onClose={() => { setShowModal(false); setEditingItem(undefined); }}
          chamadaItens={itensDisponiveis.map((i) => ({ produto: i.produto, unidade: i.unidade, categoria: i.categoria }))}
        />
      )}
    </div>
  );
}
