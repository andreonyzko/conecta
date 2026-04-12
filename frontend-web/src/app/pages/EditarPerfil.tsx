import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Trash2, Leaf, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { ProdutoAgricultor } from '../types';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const CATEGORIAS = [
  'Hortaliças',
  'Frutas',
  'Leguminosas',
  'Raízes e Tubérculos',
  'Grãos e Cereais',
  'Laticínios',
  'Outro',
];

const inputClass =
  'w-full bg-[#1D2226] border border-[#2F3336] text-white rounded-xl px-4 py-3 focus:border-[#149D7F] focus:outline-none placeholder:text-[#B0B3B8]';
const labelClass = 'block text-[#B0B3B8] mb-1.5';

interface ProdutoForm extends Omit<ProdutoAgricultor, 'id'> {}

function ProdutoModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: ProdutoAgricultor;
  onSave: (p: ProdutoAgricultor) => void;
  onClose: () => void;
}) {
  const initialCategoria =
    initial && CATEGORIAS.includes(initial.categoria) ? initial.categoria : initial?.categoria ? 'Outro' : '';
  const [form, setForm] = useState<ProdutoForm>(
    initial ?? {
      nome: '',
      categoria: '',
      capacidadeMensal: 0,
      unidade: 'kg',
      mesesDisponiveis: [],
      organico: false,
      precoSugerido: 0,
    }
  );
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(initialCategoria);
  const [outraCategoria, setOutraCategoria] = useState(
    initialCategoria === 'Outro' ? initial?.categoria || '' : ''
  );

  const toggleMes = (m: string) => {
    setForm((f) => ({
      ...f,
      mesesDisponiveis: f.mesesDisponiveis.includes(m)
        ? f.mesesDisponiveis.filter((x) => x !== m)
        : [...f.mesesDisponiveis, m],
    }));
  };

  const handleSave = () => {
    const categoriaFinal = categoriaSelecionada === 'Outro' ? outraCategoria.trim() : categoriaSelecionada;

    if (!form.nome.trim() || !categoriaFinal) {
      toast.error('Preencha o nome e a categoria.');
      return;
    }
    onSave({ ...form, categoria: categoriaFinal, id: initial?.id || `prod-${Date.now()}` });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/60">
      <div className="w-full bg-[#1D2226] rounded-t-2xl border-t border-[#2F3336] flex flex-col max-h-[88%]">
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#2F3336] flex-shrink-0">
          <h3 className="text-white" style={{ fontSize: '16px', fontWeight: 700 }}>
            {initial ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          <button onClick={onClose} className="text-[#B0B3B8] p-1 active:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto agro-scroll px-4 py-4 flex-1 flex flex-col gap-4">
          <div>
            <label className={labelClass} style={{ fontSize: '14px' }}>Nome do produto</label>
            <input
              className={inputClass}
              style={{ fontSize: '14px' }}
              placeholder="Ex: Alface Americana"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass} style={{ fontSize: '14px' }}>Categoria</label>
            <select
              className={inputClass}
              style={{ fontSize: '14px' }}
              value={categoriaSelecionada}
              onChange={(e) => {
                const value = e.target.value;
                setCategoriaSelecionada(value);
                if (value !== 'Outro') {
                  setForm((f) => ({ ...f, categoria: value }));
                }
              }}
            >
              <option value="">Selecione uma categoria</option>
              {CATEGORIAS.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
            {categoriaSelecionada === 'Outro' && (
              <input
                className={`${inputClass} mt-2`}
                style={{ fontSize: '14px' }}
                placeholder="Digite a categoria"
                value={outraCategoria}
                onChange={(e) => {
                  setOutraCategoria(e.target.value);
                  setForm((f) => ({ ...f, categoria: e.target.value }));
                }}
              />
            )}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass} style={{ fontSize: '14px' }}>Capacidade mensal</label>
              <input
                type="number"
                className={inputClass}
                style={{ fontSize: '14px' }}
                placeholder="500"
                value={form.capacidadeMensal || ''}
                onChange={(e) => setForm((f) => ({ ...f, capacidadeMensal: Number(e.target.value) }))}
              />
            </div>
            <div className="w-24">
              <label className={labelClass} style={{ fontSize: '14px' }}>Unidade</label>
              <select
                className={inputClass}
                style={{ fontSize: '14px' }}
                value={form.unidade}
                onChange={(e) => setForm((f) => ({ ...f, unidade: e.target.value }))}
              >
                <option value="kg">kg</option>
                <option value="un">un</option>
                <option value="cx">cx</option>
                <option value="lt">lt</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass} style={{ fontSize: '14px' }}>Preço sugerido (R$/unidade)</label>
            <input
              type="number"
              step="0.01"
              className={inputClass}
              style={{ fontSize: '14px' }}
              placeholder="4.50"
              value={form.precoSugerido || ''}
              onChange={(e) => setForm((f) => ({ ...f, precoSugerido: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className={labelClass} style={{ fontSize: '14px' }}>Meses disponíveis</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {MESES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMes(m)}
                  className={`px-3 py-1.5 rounded-full border transition-colors ${
                    form.mesesDisponiveis.includes(m)
                      ? 'bg-[#149D7F] border-[#149D7F] text-white'
                      : 'border-[#2F3336] text-[#B0B3B8]'
                  }`}
                  style={{ fontSize: '12px', fontWeight: form.mesesDisponiveis.includes(m) ? 600 : 400 }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, organico: !f.organico }))}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                form.organico ? 'bg-[#149D7F] border-[#149D7F]' : 'border-[#2F3336]'
              }`}
            >
              {form.organico && <span className="text-white text-xs">✓</span>}
            </button>
            <div className="flex items-center gap-1.5">
              <Leaf size={14} className="text-[#149D7F]" />
              <label className="text-white" style={{ fontSize: '14px' }}>Produto orgânico</label>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 border-t border-[#2F3336] flex-shrink-0">
          <button
            onClick={handleSave}
            className="w-full bg-[#149D7F] text-white rounded-full py-3.5 active:opacity-80"
            style={{ fontSize: '15px', fontWeight: 600 }}
          >
            {initial ? 'Salvar alterações' : 'Adicionar produto'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AgricultorForm() {
  const navigate = useNavigate();
  const { currentUserId, getAgricultor, updateAgricultor } = useAppContext();
  const agr = getAgricultor(currentUserId)!;

  const [nome, setNome] = useState(agr.nome);
  const [cpf, setCpf] = useState(agr.cpf);
  const [caf, setCaf] = useState(agr.caf);
  const [telefone, setTelefone] = useState(agr.telefone);
  const [email, setEmail] = useState(agr.email);
  const [realizaEntrega, setRealizaEntrega] = useState(agr.realizaEntrega);
  const [produtos, setProdutos] = useState<ProdutoAgricultor[]>(agr.produtos);
  const [showModal, setShowModal] = useState(false);
  const [editingProduto, setEditingProduto] = useState<ProdutoAgricultor | undefined>();

  const handleSave = () => {
    if (!nome.trim()) { toast.error('Informe o nome.'); return; }
    updateAgricultor({ ...agr, nome, cpf, caf, telefone, email, realizaEntrega, produtos });
    toast.success('Perfil atualizado com sucesso!');
    navigate('/perfil');
  };

  const handleAddProduto = (p: ProdutoAgricultor) => {
    if (editingProduto) {
      setProdutos((prev) => prev.map((x) => (x.id === p.id ? p : x)));
    } else {
      setProdutos((prev) => [...prev, p]);
    }
    setShowModal(false);
    setEditingProduto(undefined);
  };

  return (
    <div className="relative flex-1 flex flex-col bg-[#121212] min-h-0">
      <div className="bg-[#1D2226] border-b border-[#2F3336] px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full active:bg-[#2F3336] text-white">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-white flex-1" style={{ fontSize: '16px', fontWeight: 600 }}>Editar Perfil</h2>
      </div>

      <div className="flex-1 overflow-y-auto agro-scroll px-4 pt-5 pb-4 flex flex-col gap-4">
        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>Nome completo</label>
          <input className={inputClass} style={{ fontSize: '14px' }} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
        </div>
        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>CPF/CNPJ</label>
          <input className={inputClass} style={{ fontSize: '14px' }} value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
        </div>
        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>CAF (Cadastro da Agricultura Familiar)</label>
          <input className={inputClass} style={{ fontSize: '14px' }} value={caf} onChange={(e) => setCaf(e.target.value)} placeholder="CAF-TO-2024-000000" />
        </div>
        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>Telefone</label>
          <input className={inputClass} style={{ fontSize: '14px' }} value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" />
        </div>
        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>E-mail</label>
          <input className={inputClass} style={{ fontSize: '14px' }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        </div>

        <div className="flex items-center gap-3 py-1">
          <button
            type="button"
            onClick={() => setRealizaEntrega(!realizaEntrega)}
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${realizaEntrega ? 'bg-[#149D7F] border-[#149D7F]' : 'border-[#2F3336]'}`}
          >
            {realizaEntrega && <span className="text-white text-xs">✓</span>}
          </button>
          <label className="text-white" style={{ fontSize: '14px' }}>Realizo entrega própria</label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white" style={{ fontSize: '15px', fontWeight: 600 }}>Meus Produtos</span>
            <button
              onClick={() => { setEditingProduto(undefined); setShowModal(true); }}
              className="flex items-center gap-1.5 text-[#149D7F]"
              style={{ fontSize: '13px', fontWeight: 600 }}
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>
          {produtos.length === 0 ? (
            <p className="text-[#B0B3B8] text-center py-4" style={{ fontSize: '14px' }}>Nenhum produto</p>
          ) : (
            produtos.map((p) => (
              <div key={p.id} className="bg-[#1D2226] border border-[#2F3336] rounded-xl p-3.5 mb-2 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white" style={{ fontSize: '14px', fontWeight: 600 }}>{p.nome}</p>
                  <p className="text-[#B0B3B8]" style={{ fontSize: '12px' }}>{p.categoria} · {p.capacidadeMensal} {p.unidade}/mês</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingProduto(p); setShowModal(true); }} className="text-[#149D7F] p-1.5 active:opacity-60">
                    <Plus size={15} />
                  </button>
                  <button onClick={() => setProdutos((prev) => prev.filter((x) => x.id !== p.id))} className="text-[#E74C3C] p-1.5 active:opacity-60">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-shrink-0 px-4 pb-5 pt-3 border-t border-[#2F3336] bg-[#121212]">
        <button onClick={handleSave} className="w-full bg-[#149D7F] text-white rounded-full py-3.5 active:opacity-80" style={{ fontSize: '15px', fontWeight: 600 }}>
          Salvar Alterações
        </button>
      </div>

      {showModal && (
        <ProdutoModal
          initial={editingProduto}
          onSave={handleAddProduto}
          onClose={() => { setShowModal(false); setEditingProduto(undefined); }}
        />
      )}
    </div>
  );
}

function InstituicaoForm() {
  const navigate = useNavigate();
  const { currentUserId, getInstituicao, updateInstituicao } = useAppContext();
  const inst = getInstituicao(currentUserId)!;

  const [nome, setNome] = useState(inst.nome);
  const [cnpj, setCnpj] = useState(inst.cnpj);
  const [telefone, setTelefone] = useState(inst.telefone);
  const [email, setEmail] = useState(inst.email);
  const [numeroAlunos, setNumeroAlunos] = useState(inst.numeroAlunos);

  const handleSave = () => {
    if (!nome.trim()) { toast.error('Informe o nome.'); return; }
    updateInstituicao({ ...inst, nome, cnpj, telefone, email, numeroAlunos });
    toast.success('Perfil atualizado com sucesso!');
    navigate('/perfil');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#121212] min-h-0">
      <div className="bg-[#1D2226] border-b border-[#2F3336] px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full active:bg-[#2F3336] text-white">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-white flex-1" style={{ fontSize: '16px', fontWeight: 600 }}>Editar Perfil</h2>
      </div>

      <div className="flex-1 overflow-y-auto agro-scroll px-4 pt-5 pb-4 flex flex-col gap-4">
        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>Nome da instituição</label>
          <input className={inputClass} style={{ fontSize: '14px' }} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da escola" />
        </div>
        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>CNPJ</label>
          <input className={inputClass} style={{ fontSize: '14px' }} value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0001-00" />
        </div>
        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>Telefone</label>
          <input className={inputClass} style={{ fontSize: '14px' }} value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 0000-0000" />
        </div>
        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>E-mail</label>
          <input className={inputClass} style={{ fontSize: '14px' }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contato@escola.edu.br" />
        </div>
        <div>
          <label className={labelClass} style={{ fontSize: '14px' }}>Número de alunos</label>
          <input type="number" className={inputClass} style={{ fontSize: '14px' }} value={numeroAlunos} onChange={(e) => setNumeroAlunos(Number(e.target.value))} placeholder="850" />
        </div>
      </div>

      <div className="flex-shrink-0 px-4 pb-5 pt-3 border-t border-[#2F3336] bg-[#121212]">
        <button onClick={handleSave} className="w-full bg-[#149D7F] text-white rounded-full py-3.5 active:opacity-80" style={{ fontSize: '15px', fontWeight: 600 }}>
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}

export function EditarPerfil() {
  const { role } = useAppContext();
  return role === 'agricultor' ? <AgricultorForm /> : <InstituicaoForm />;
}
