from collections import deque
import uuid


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

    def get_all_descendants(self):
        queue = deque([self])  # agrega el nodo inicial a la cola
        visited = set([self])  # agrega el nodo inicial a los visitados
        while queue:
            current_node = queue.popleft()  # saca el primer nodo de la cola
            for child in current_node.children:  # recorre los hijos del nodo actual
                if child not in visited:  # si el hijo no ha sido visitado
                    queue.append(child)  # agrega el hijo a la cola
                    visited.add(child)  # agrega el hijo a los visitados

        return visited

    def get_connections(self):
        return [self.parent] + self.children


def link(parent, child):
    parent.add_child(child)
    child.set_parent(parent)


def sumTuples(a, b):
    return tuple(map(sum, zip(a, b)))


def graph_to_dict(a, transition_vector=(0, 0)):
    g_dict = dict()

    for node in a.get_all_descendants():
        if node.parent:
            g_dict[sumTuples(node.coordinate, transition_vector)] = set([sumTuples(
                node.parent.coordinate, transition_vector)] + [sumTuples(x.coordinate, transition_vector) for x in node.children])
        else:
            g_dict[sumTuples(node.coordinate, transition_vector)] = set(
                [sumTuples(x.coordinate, transition_vector) for x in node.children])
    return g_dict


def get_left_top_node(nodes):  # busca el X mas bajo, despues el Y mas bajo
    left_top = sorted(nodes, key=lambda node: (abs(node.x), abs(node.y)))
    return left_top[0]


def get_transition_vector(correct_graph, test_graph):
    correct_nodes = correct_graph.get_all_descendants()
    test_nodes = test_graph.get_all_descendants()

    correct_left_top_node = get_left_top_node(correct_nodes)
    test_left_top_node = get_left_top_node(test_nodes)

    transition_vector = (correct_left_top_node.x - test_left_top_node.x,
                        correct_left_top_node.y - test_left_top_node.y)
    return transition_vector


def graphs_are_equal(a, b):
    transition_vector = get_transition_vector(a, b)
    correct_dict = graph_to_dict(a)
    test_dict = graph_to_dict(b, transition_vector)
    if correct_dict == test_dict:
        return True
    return False


a1 = Node((0, 2))
a2 = Node((1, 0))
a3 = Node((5, 2))
a4 = Node((7, 3))
a5 = Node((7, 1))

link(a1, a2)
link(a2, a3)
link(a3, a4)
link(a3, a5)


b1 = Node((7+20, 3+10))
b2 = Node((5+20, 2+10))
b3 = Node((7+20, 1+10))
b4 = Node((1+20, 0+10))
b5 = Node((0+20, 2+10))

link(b1, b2)
link(b2, b3)
link(b2, b4)
link(b4, b5)

print(graphs_are_equal(a1, b1))
