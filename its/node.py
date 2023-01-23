from collections import deque


class Node:
    def __init__(self, coord):
        self.id = None
        self.coordinate = coord
        self.parent = None
        self.children = []

        self.link = None
        self.linkRotation = None

        self.forces = []
        self.moments = []

        self.isOrigin = False

    def __str__(self, level=0):
        indent = ' ' * (level * 4)
        s = '\n' + '\n'.join([f'{indent}id = {self.id}',
            f'{indent}coordinate = {self.coordinate}',
            f'{indent}isOrigin = {self.isOrigin}',
            f'{indent}link = {self.link}',
            f'{indent}linkRotation = {self.linkRotation}',
            f'{indent}forces = {self.forces}',
            f'{indent}moments = {self.moments}'])
        for child in self.children:
            s += child.__str__(level + 1)
        return s

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

    def set_node_with_dict(self, node_dict):
        self.coordinate = node_dict["coordinate"]
        self.link = node_dict["link"]
        self.linkRotation = node_dict["linkRotation"]
        self.forces = node_dict["forces"]
        self.moments = node_dict["moments"]
        self.isOrigin = node_dict["isOrigin"]
        self.id = node_dict["id"]


def create_node_from_dict(node_dict):
    node = Node(None)
    node.set_node_with_dict(node_dict)
    return node

def recreate_dcl(node_dict):
    node = create_node_from_dict(node_dict)
    for child in node_dict["childNodes"]:
        child_node = recreate_dcl(child)
        link(node, child_node)
    return node



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
    left_top = sorted(nodes, key=lambda node: (abs(node.coordinate[0]), abs(node.coordinate[1])))
    return left_top[0]


def get_transition_vector(correct_graph, test_graph):
    correct_nodes = correct_graph.get_all_descendants()
    test_nodes = test_graph.get_all_descendants()

    correct_left_top_node = get_left_top_node(correct_nodes)
    test_left_top_node = get_left_top_node(test_nodes)

    transition_vector = (correct_left_top_node.coordinate[0] - test_left_top_node.coordinate[0],
                        correct_left_top_node.coordinate[1] - test_left_top_node.coordinate[1])
    return transition_vector


def graphs_are_equal(correct, test):
    transition_vector = get_transition_vector(correct, test)
    correct_dict = graph_to_dict(correct)
    test_dict = graph_to_dict(test, transition_vector)
    # print(correct_dict)
    # print(test_dict)
    if correct_dict == test_dict:
        return True
    return False


def veryfy_step_3(correct_graph, test_graph):
    all_correct_nodes = sorted(list(correct_graph.get_all_descendants()), key=lambda x: x.id)
    all_test_nodes = sorted(list(test_graph.get_all_descendants()), key=lambda x: x.id)
    
    correct = True

    errors = []

    for i in range(len(all_correct_nodes)):
        correct_node = all_correct_nodes[i]
        test_node = all_test_nodes[i]
        if correct_node.link != test_node.link:
            errors.append(f'El nodo {test_node.id} tiene un link incorrecto')
            correct = False
        elif correct_node.linkRotation != test_node.linkRotation:
            errors.append(f'El nodo {test_node.id} tiene un linkRotation incorrecto')
            correct = False
        if correct_node.forces != test_node.forces:
            errors.append(f'El nodo {test_node.id} tiene un forces incorrecto')
            correct = False
        if correct_node.moments != test_node.moments:
            errors.append(f'El nodo {test_node.id} tiene un moments incorrecto')
            correct = False
        if correct_node.isOrigin != test_node.isOrigin:
            errors.append(f'El nodo {test_node.id} tiene un isOrigin incorrecto')
            correct = False

    return {"status": correct, "errors": errors}
