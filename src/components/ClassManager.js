import React, { useState } from 'react';
import styled from 'styled-components';
import { useClasses } from '../context/ClassContext';
import { FiX, FiPlus, FiEdit3, FiTrash2, FiStar, FiHome, FiTruck, FiNavigation, FiBriefcase, FiBarChart, FiHeart, FiShoppingBag, FiBook } from 'react-icons/fi';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--card-bg);
  border-radius: 12px 12px 0 0;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const ModalTitle = styled.h2`
  color: var(--text);
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-secondary);
    color: var(--text);
  }

  &:focus {
    outline: 2px solid var(--primary);
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    color: var(--text);
    background-color: var(--bg-secondary);
  }

  ${props => props.active && `
    color: var(--primary);
    border-bottom-color: var(--primary);
  `}
`;

const ClassGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ClassCard = styled.div`
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card-bg);
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.1);
  }

  ${props => props.isDefault && `
    border-color: var(--primary);
    background-color: var(--primary-light);
  `}
`;

const ClassCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ClassColorBig = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color || '#2E7D32'};
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const ClassIcon = styled.div`
  color: ${props => props.color || '#2E7D32'};
  font-size: 1.2rem;
`;

const ClassCardInfo = styled.div`
  flex: 1;
`;

const ClassCardName = styled.h3`
  margin: 0 0 0.25rem 0;
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 600;
`;

const ClassCardDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
`;

const ClassCardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  &:focus {
    outline: 2px solid var(--primary);
    border-color: transparent;
  }

  &.danger:hover {
    border-color: var(--danger);
    color: var(--danger);
  }
`;

const DefaultBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: var(--primary);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const FormContainer = styled.div`
  background-color: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--text);
  font-weight: 500;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background-color: var(--card-bg);
  color: var(--text);
  font-size: 1rem;

  &:focus {
    outline: 2px solid var(--primary);
    border-color: transparent;
  }

  &::placeholder {
    color: var(--text-secondary);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background-color: var(--card-bg);
  color: var(--text);
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: 2px solid var(--primary);
    border-color: transparent;
  }

  &::placeholder {
    color: var(--text-secondary);
  }
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ColorOption = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? 'var(--primary)' : 'var(--border)'};
  background-color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    border-color: var(--primary);
  }

  &:focus {
    outline: 2px solid var(--primary);
  }
`;

const IconPicker = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const IconOption = styled.button`
  padding: 0.5rem;
  border: 1px solid ${props => props.selected ? 'var(--primary)' : 'var(--border)'};
  border-radius: 6px;
  background-color: ${props => props.selected ? 'var(--primary-light)' : 'var(--card-bg)'};
  color: ${props => props.selected ? 'var(--primary)' : 'var(--text-secondary)'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  &:focus {
    outline: 2px solid var(--primary);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: 2px solid var(--primary);
  }

  &.primary {
    background-color: var(--primary);
    color: white;

    &:hover {
      background-color: var(--primary-hover);
    }

    &:disabled {
      background-color: var(--text-secondary);
      cursor: not-allowed;
    }
  }

  &.secondary {
    background-color: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);

    &:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
  }
`;

const COLORS = [
  '#2E7D32', '#1565C0', '#C62828', '#F9A825', 
  '#7B1FA2', '#E65100', '#00695C', '#37474F',
  '#D32F2F', '#303F9F', '#388E3C', '#F57C00'
];

const ICONS = [
  { name: 'home', component: FiHome },
  { name: 'briefcase', component: FiBriefcase },
  { name: 'truck', component: FiTruck },
  { name: 'navigation', component: FiNavigation },
  { name: 'chart', component: FiBarChart },
  { name: 'heart', component: FiHeart },
  { name: 'shopping', component: FiShoppingBag },
  { name: 'book', component: FiBook }
];

const ClassManager = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#2E7D32',
    icon: 'home',
    budget: ''
  });
  const [loading, setLoading] = useState(false);

  const { classes, createClass, updateClass, deleteClass, setDefaultClass } = useClasses();

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#2E7D32',
      icon: 'home',
      budget: ''
    });
    setEditingClass(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const classData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null
      };

      if (editingClass) {
        await updateClass(editingClass.id, classData);
      } else {
        await createClass(classData);
      }

      resetForm();
      setActiveTab('list');
    } catch (error) {
      console.error('Erro ao salvar classe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classItem) => {
    setFormData({
      name: classItem.name,
      description: classItem.description || '',
      color: classItem.color,
      icon: classItem.icon,
      budget: classItem.budget || ''
    });
    setEditingClass(classItem);
    setActiveTab('form');
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Tem certeza que deseja deletar esta classe?')) {
      try {
        await deleteClass(classId);
      } catch (error) {
        alert('Erro ao deletar classe: ' + error.message);
      }
    }
  };

  const handleSetDefault = async (classId) => {
    try {
      await setDefaultClass(classId);
    } catch (error) {
      console.error('Erro ao definir classe padrão:', error);
    }
  };

  const getIconComponent = (iconName) => {
    const icon = ICONS.find(i => i.name === iconName);
    return icon ? icon.component : FiHome;
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Gerenciar Classes</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <TabContainer>
            <Tab 
              active={activeTab === 'list'} 
              onClick={() => setActiveTab('list')}
            >
              Minhas Classes ({classes.length})
            </Tab>
            <Tab 
              active={activeTab === 'form'} 
              onClick={() => { setActiveTab('form'); resetForm(); }}
            >
              <FiPlus size={16} style={{ marginRight: '0.5rem' }} />
              {editingClass ? 'Editar Classe' : 'Nova Classe'}
            </Tab>
          </TabContainer>

          {activeTab === 'list' && (
            <ClassGrid>
              {classes.map(classItem => {
                const IconComponent = getIconComponent(classItem.icon);
                return (
                  <ClassCard key={classItem.id} isDefault={classItem.isDefault}>
                    {classItem.isDefault && (
                      <DefaultBadge>
                        <FiStar size={12} />
                        Padrão
                      </DefaultBadge>
                    )}
                    
                    <ClassCardHeader>
                      <ClassColorBig color={classItem.color} />
                      <ClassIcon color={classItem.color}>
                        <IconComponent />
                      </ClassIcon>
                      <ClassCardInfo>
                        <ClassCardName>{classItem.name}</ClassCardName>
                        <ClassCardDescription>
                          {classItem.description || 'Sem descrição'}
                        </ClassCardDescription>
                      </ClassCardInfo>
                    </ClassCardHeader>

                    {classItem.budget && (
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--text-secondary)',
                        marginBottom: '1rem'
                      }}>
                        Orçamento: R$ {classItem.budget.toLocaleString('pt-BR')}
                      </div>
                    )}

                    <ClassCardActions>
                      <ActionButton onClick={() => handleEdit(classItem)}>
                        <FiEdit3 size={16} />
                      </ActionButton>
                      
                      {!classItem.isDefault && (
                        <ActionButton onClick={() => handleSetDefault(classItem.id)}>
                          <FiStar size={16} />
                        </ActionButton>
                      )}
                      
                      {classes.length > 1 && (
                        <ActionButton 
                          className="danger"
                          onClick={() => handleDelete(classItem.id)}
                        >
                          <FiTrash2 size={16} />
                        </ActionButton>
                      )}
                    </ClassCardActions>
                  </ClassCard>
                );
              })}
            </ClassGrid>
          )}

          {activeTab === 'form' && (
            <FormContainer>
              <form onSubmit={handleSubmit}>
                <FormGrid>
                  <FormGroup>
                    <Label>Nome da Classe *</Label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Férias 2025"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Orçamento (opcional)</Label>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="Ex: 5000"
                      min="0"
                      step="0.01"
                    />
                  </FormGroup>
                </FormGrid>

                <FormGroup style={{ marginBottom: '1rem' }}>
                  <Label>Descrição</Label>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o propósito desta classe..."
                  />
                </FormGroup>

                <FormGroup style={{ marginBottom: '1rem' }}>
                  <Label>Cor</Label>
                  <ColorPicker>
                    {COLORS.map(color => (
                      <ColorOption
                        key={color}
                        type="button"
                        color={color}
                        selected={formData.color === color}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                      />
                    ))}
                  </ColorPicker>
                </FormGroup>

                <FormGroup style={{ marginBottom: '2rem' }}>
                  <Label>Ícone</Label>
                  <IconPicker>
                    {ICONS.map(({ name, component: IconComponent }) => (
                      <IconOption
                        key={name}
                        type="button"
                        selected={formData.icon === name}
                        onClick={() => setFormData(prev => ({ ...prev, icon: name }))}
                      >
                        <IconComponent size={16} />
                      </IconOption>
                    ))}
                  </IconPicker>
                </FormGroup>

                <ButtonContainer>
                  <Button 
                    type="button" 
                    className="secondary" 
                    onClick={() => { resetForm(); setActiveTab('list'); }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="primary"
                    disabled={loading || !formData.name.trim()}
                  >
                    {loading ? 'Salvando...' : editingClass ? 'Atualizar' : 'Criar Classe'}
                  </Button>
                </ButtonContainer>
              </form>
            </FormContainer>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ClassManager;
