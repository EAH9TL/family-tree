import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { useFamilyStore } from '../../store/familyStore';
import { convertToReactFlowElements } from '../../utils/treeLayout';
import PersonNode from './PersonNode';

const nodeTypes = {
  person: PersonNode,
};

const TreeView: React.FC = () => {
  const { persons, selectPerson } = useFamilyStore();
  const { nodes, edges } = convertToReactFlowElements(persons);

  const onNodeClick = (_: any, node: any) => {
    const person = persons.find(p => p.id === node.id);
    if (person) {
      selectPerson(person);
    }
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        attributionPosition="bottom-right"
        panOnScroll={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        preventScrolling={true}
      >
        <Background color="#cbd5e1" gap={16} />
        <Controls 
          showInteractive={false} 
          className="!bottom-4 !left-4 md:!bottom-6 md:!left-6 !bg-white !border-2 !border-gray-200 !rounded-xl !shadow-lg [&>button]:!w-10 [&>button]:!h-10 md:[&>button]:!w-8 md:[&>button]:!h-8 [&>button]:!text-lg md:[&>button]:!text-base"
        />
        <MiniMap 
          className="!bg-white !border-2 !border-gray-200 !rounded-xl !shadow-lg hidden md:block"
          nodeColor={(node) => {
            const person = persons.find(p => p.id === node.id);
            return person?.gender === 'male' ? '#3b82f6' : '#ec4899';
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default TreeView;