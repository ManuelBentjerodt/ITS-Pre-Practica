import time
from collections import deque
import uuid

def link(parent, child):
    parent.add_child(child)
    child.set_parent(parent)



class Node:
    def __init__(self, coord):
        self.id = uuid.uuid4()
        self.coordinate = coord
        self.parent = None
        self.children = []
        self.x = coord[0]
        self.y = coord[1]

    def add_child(self, child):
        self.children.append(child)

    def set_parent(self, parent):
        self.parent = parent

    def get_node_by_id(self, id):
        if self.id == id:
            return self
        for child in self.children:
            node = child.get_node_by_id(id)
            if node is not None:
                return node
        return None

    def __str__(self):
        ret = f"Node: {self.coordinate} | id: {self.id}"
        return ret

    def get_nodes_by_coordinate(self, coord):
        if self.coordinate == coord:
            return self
        for child in self.children:
            node = child.get_nodes_by_coordinate(coord)
            if node is not None:
                return node
        return None

    def get_al_descendents(self):
        queue = deque([self]) # agrega el nodo inicial a la cola
        visited = set([self]) # agrega el nodo inicial a los visitados
        while queue:
            current_node = queue.popleft() # saca el primer nodo de la cola
            for child in current_node.children: # recorre los hijos del nodo actual
                if child not in visited: # si el hijo no ha sido visitado
                    queue.append(child) # agrega el hijo a la cola
                    visited.add(child) # agrega el hijo a los visitados
        
        return visited

    def is_similar(self, node, transition_vector):
        if self.coordinate == [node.x + transition_vector[0], node.y + transition_vector[1]]:
            return True
        return False

    def set_x(self, x):
        self.x = x
        self.coordinate[0] = x

    def set_y(self, y):
        self.y = y
        self.coordinate[1] = y

    def get_connections(self):
        return [self.parent] + self.children 


def get_left_top_node(nodes): #busca el X mas bajo, despues el Y mas bajo
    left_top = sorted(nodes, key=lambda node: (abs(node.x), abs(node.y)))
    return left_top[0]




def get_transision_vector(correct_graph, test_graph):
    correct_nodes = correct_graph.get_al_decsendents()
    test_nodes = test_graph.get_al_decsendents()

    correct_left_top_node = get_left_top_node(correct_nodes)
    test_left_top_node = get_left_top_node(test_nodes)

    transision_vector = (correct_left_top_node.x - test_left_top_node.x, correct_left_top_node.y - test_left_top_node.y)
    return transision_vector







a1 = Node([0, 0])
a2 = Node([1, 1])
a3 = Node([3, 0])
link(a1, a2)
link(a2, a3)
print(f"{a1} ")
print(f"{a2}")
print(f"{a3}\n")


b1 = Node([0 + 10, 0 + 10])
b2 = Node([3 + 10, 0 + 10])
b3 = Node([1 + 10, 1 + 10])
link(b1, b2)
link(b2, b3)
print(f"{b1}")
print(f"{b2}")
print(f"{b3}\n")
equally_displaced(a1, b1)











