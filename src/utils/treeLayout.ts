import type { Node, Edge } from 'reactflow';
import type { Person } from '../types';

interface TreeNode extends Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    firstName: string;
    lastName: string;
    gender: string;
    hasMedical: boolean;
    hasHereditary: boolean;
  };
}

export const convertToReactFlowElements = (persons: Person[]): { nodes: TreeNode[]; edges: Edge[] } => {
  const nodes: TreeNode[] = [];
  const edges: Edge[] = [];

  if (!persons || persons.length === 0) {
    return { nodes, edges };
  }

  // Calcular generaciones
  const generations = calculateGenerations(persons);
  const generationMap = new Map<number, Person[]>();

  // Agrupar personas por generación
  persons.forEach(person => {
    const gen = generations.get(person.id) || 0;
    if (!generationMap.has(gen)) {
      generationMap.set(gen, []);
    }
    generationMap.get(gen)!.push(person);
  });

  // Crear nodos
  const sortedGenerations = Array.from(generationMap.keys()).sort((a, b) => a - b);
  
  sortedGenerations.forEach((gen, genIndex) => {
    const personsInGen = generationMap.get(gen)!;
    const yPosition = genIndex * 200;

    personsInGen.forEach((person, index) => {
      const xPosition = (index - personsInGen.length / 2) * 250 + 400;

      nodes.push({
        id: person.id,
        type: 'person',
        position: { x: xPosition, y: yPosition },
        data: {
          firstName: person.firstName,
          lastName: person.lastName,
          gender: person.gender,
          hasMedical: person.medicalConditions && person.medicalConditions.length > 0,
          hasHereditary: person.medicalConditions?.some(m => m.isHereditary) || false,
        },
      });
    });
  });

  // Crear edges (conexiones padre-hijo)
  persons.forEach(person => {
    if (person.fatherId) {
      edges.push({
        id: `${person.fatherId}-${person.id}`,
        source: person.fatherId,
        target: person.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
      });
    }

    if (person.motherId) {
      edges.push({
        id: `${person.motherId}-${person.id}`,
        source: person.motherId,
        target: person.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
      });
    }
  });

  return { nodes, edges };
};

// Calcular la generación de cada persona (0 = raíz, sin padres)
const calculateGenerations = (persons: Person[]): Map<string, number> => {
  const generations = new Map<string, number>();
  const visited = new Set<string>();

  const calculateGen = (personId: string): number => {
    if (generations.has(personId)) {
      return generations.get(personId)!;
    }

    if (visited.has(personId)) {
      return 0; // Evitar ciclos infinitos
    }

    visited.add(personId);

    const person = persons.find(p => p.id === personId);
    if (!person) return 0;

    let maxParentGen = -1;

    if (person.fatherId) {
      maxParentGen = Math.max(maxParentGen, calculateGen(person.fatherId));
    }

    if (person.motherId) {
      maxParentGen = Math.max(maxParentGen, calculateGen(person.motherId));
    }

    const gen = maxParentGen + 1;
    generations.set(personId, gen);
    return gen;
  };

  persons.forEach(person => {
    calculateGen(person.id);
  });

  return generations;
};

// Función auxiliar para obtener color según severidad
export const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case 'leve':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'moderada':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'grave':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Función auxiliar para obtener color según estado
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'activa':
      return 'bg-red-100 text-red-800';
    case 'controlada':
      return 'bg-blue-100 text-blue-800';
    case 'curada':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};