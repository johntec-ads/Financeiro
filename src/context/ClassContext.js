import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../services/firebase';

const ClassContext = createContext();

export const useClasses = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClasses deve ser usado dentro de ClassProvider');
  }
  return context;
};

export const ClassProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Carregar classes do usuário
  useEffect(() => {
    if (!currentUser) {
      setClasses([]);
      setActiveClass(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const classesRef = collection(db, 'users', currentUser.uid, 'classes');
    const q = query(classesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const classesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setClasses(classesData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Erro ao carregar classes:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Efeito separado para definir classe ativa
  useEffect(() => {
    if (!loading && classes.length > 0 && !activeClass) {
      // Verificar se há uma classe salva no localStorage
      const savedClassId = localStorage.getItem('activeClassId');
      
      let classToActivate = null;
      
      if (savedClassId) {
        classToActivate = classes.find(c => c.id === savedClassId);
      }
      
      // Se não encontrou a classe salva, usar a padrão ou primeira
      if (!classToActivate) {
        classToActivate = classes.find(c => c.isDefault) || classes[0];
      }
      
      if (classToActivate) {
        setActiveClass(classToActivate);
      }
    }
  }, [classes, loading, activeClass]);

  // Efeito separado para criar classe padrão quando necessário
  useEffect(() => {
    if (!currentUser || loading || classes.length > 0) return;

    // Se não há classes, criar uma padrão
    const createDefaultClass = async () => {
      try {
        const defaultClassData = {
          name: 'Contabilidade Geral',
          description: 'Controle financeiro pessoal',
          color: '#2E7D32',
          icon: 'home',
          budget: null,
          isDefault: true,
          isActive: true,
          createdAt: new Date()
        };

        const classesRef = collection(db, 'users', currentUser.uid, 'classes');
        await addDoc(classesRef, defaultClassData);
      } catch (error) {
        console.error('Erro ao criar classe padrão:', error);
        setError(error);
      }
    };

    createDefaultClass();
  }, [currentUser, loading, classes.length]);

  // Criar nova classe
  const createClass = async (classData) => {
    if (!currentUser) return;

    try {
      const newClassData = {
        ...classData,
        isActive: true,
        createdAt: new Date()
      };

      const classesRef = collection(db, 'users', currentUser.uid, 'classes');
      const docRef = await addDoc(classesRef, newClassData);
      
      return { id: docRef.id, ...newClassData };
    } catch (error) {
      console.error('Erro ao criar classe:', error);
      setError(error);
      throw error;
    }
  };

  // Atualizar classe
  const updateClass = async (classId, updates) => {
    if (!currentUser) return;

    try {
      // Tentar primeiro o formato novo (aninhado)
      const classRef = doc(db, 'users', currentUser.uid, 'classes', classId);
      
      // Se está definindo como padrão, remover de outras primeiro
      if (updates.isDefault) {
        await Promise.all(
          classes.map(async (cls) => {
            if (cls.id !== classId && cls.isDefault) {
              try {
                const otherClassRef = doc(db, 'users', currentUser.uid, 'classes', cls.id);
                await updateDoc(otherClassRef, { isDefault: false });
              } catch (error) {
                console.log('Erro ao atualizar outra classe (pode ser normal se não existir):', error);
              }
            }
          })
        );
      }

      await updateDoc(classRef, {
        ...updates,
        updatedAt: new Date()
      });

      // Atualizar classe ativa se necessário
      if (activeClass && activeClass.id === classId) {
        setActiveClass(prev => ({ ...prev, ...updates }));
      }

    } catch (error) {
      console.error('Erro ao atualizar classe:', error);
      
      // Se for erro de permissão, pode ser que a classe esteja em formato legado
      if (error.code === 'permission-denied' || error.code === 'not-found') {
        console.log('Classe pode não existir no formato aninhado. Tentando criar...');
        
        try {
          // Tentar criar a classe no formato correto
          const classData = {
            ...classes.find(c => c.id === classId),
            ...updates,
            updatedAt: new Date()
          };
          
          const classesRef = collection(db, 'users', currentUser.uid, 'classes');
          await addDoc(classesRef, classData);
          
          console.log('Classe criada com sucesso no formato aninhado');
        } catch (createError) {
          console.error('Erro ao criar classe:', createError);
          setError(createError);
          throw createError;
        }
      } else {
        setError(error);
        throw error;
      }
    }
  };

  // Deletar classe
  const deleteClass = async (classId) => {
    if (!currentUser) return;

    try {
      // Não permitir deletar se é a única classe
      if (classes.length <= 1) {
        throw new Error('Não é possível deletar a única classe existente');
      }

      const classRef = doc(db, 'users', currentUser.uid, 'classes', classId);
      await deleteDoc(classRef);

      // Se a classe deletada era a ativa, selecionar outra
      if (activeClass && activeClass.id === classId) {
        const remainingClasses = classes.filter(c => c.id !== classId);
        const newActiveClass = remainingClasses.find(c => c.isDefault) || remainingClasses[0];
        setActiveClass(newActiveClass);
      }

    } catch (error) {
      console.error('Erro ao deletar classe:', error);
      setError(error);
      throw error;
    }
  };

  // Definir classe padrão
  const setDefaultClass = async (classId) => {
    try {
      // Remover isDefault de todas as classes
      await Promise.all(
        classes.map(async (cls) => {
          const classRef = doc(db, 'users', currentUser.uid, 'classes', cls.id);
          await updateDoc(classRef, { 
            isDefault: cls.id === classId 
          });
        })
      );
    } catch (error) {
      console.error('Erro ao definir classe padrão:', error);
      setError(error);
      throw error;
    }
  };

  // Alternar classe ativa
  const switchActiveClass = (classData) => {
    setActiveClass(classData);
    // Salvar preferência no localStorage
    localStorage.setItem('activeClassId', classData.id);
  };

  const value = {
    classes,
    activeClass,
    loading,
    error,
    createClass,
    updateClass,
    deleteClass,
    setDefaultClass,
    switchActiveClass,
    setActiveClass
  };

  return (
    <ClassContext.Provider value={value}>
      {children}
    </ClassContext.Provider>
  );
};
