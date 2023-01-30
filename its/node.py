from collections import deque
import math

ERROR = 0.01


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

        self.step3 = {
            "forcesX": [],
            "forcesY": [],
            "moments": [],
            "axisXsupport": [],
            "axisYsupport": [],
            "momentsSupport": [],
        }

    def __str__(self, level=0):
        indent = ' ' * (level * 4)
        s = '\n' + '\n'.join([f'{indent}id = {self.id}',
            f'{indent}coordinate = {self.coordinate}',
            f'{indent}isOrigin = {self.isOrigin}',
            f'{indent}link = {self.link}',
            f'{indent}linkRotation = {self.linkRotation}',
            f'{indent}forces = {self.forces}',
            f'{indent}moments = {self.moments}',
            f'{indent}step3 = {self.step3}'])
        
        for child in self.children:
            s += child.__str__(level + 1)
        return s

    def add_child(self, child):
        self.children.append(child)

    def set_parent(self, parent):
        self.parent = parent

    def get_all_descendants(self):
        queue = deque([self])  # agrega el nodo inicial a la cola
        visited = set([self])  #fix, no se pq, pero antes el mismo nodo estaba como decendienteeee
        while queue:
            current_node = queue.popleft()  # saca el primer nodo de la cola
            for child in current_node.children:  # recorre los hijos del nodo actual
                if child not in visited:  # si el hijo no ha sido visitado
                    queue.append(child)  # agrega el hijo a la cola
                    visited.add(child)  # agrega el hijo a los visitados

        return visited


    def get_node_by_coordinate(self, coord):
        queue = deque([self])
        visited = set([self])
        while queue:
            current_node = queue.popleft()
            if current_node.coordinate == coord:
                return current_node
            for child in current_node.children:
                if child not in visited:
                    queue.append(child)
                    visited.add(child)
        

    def get_connections(self):
        return [self.parent] + self.children

    def set_node_with_dict(self, node_dict):
        self.coordinate = tuple(node_dict["coordinate"])
        self.link = node_dict["link"]
        self.linkRotation = node_dict["linkRotation"]
        self.forces = node_dict["forces"]
        self.moments = node_dict["moments"]
        self.isOrigin = node_dict["isOrigin"]
        self.id = node_dict["id"]
        self.step3 = node_dict["step3"]


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


def nodes_are_equals(correct_graph, test_graph):
    staus = True
    errors = []

    transition_vector = get_transition_vector(correct_graph, test_graph)
    correct_dict = graph_to_dict(correct_graph)
    test_dict = graph_to_dict(test_graph, transition_vector)

    # print(test_graph)
    for coord in test_dict:
        correct_node = correct_graph.get_node_by_coordinate(coord)
        test_node = test_graph.get_node_by_coordinate(sumTuples(coord, transition_vector))
        
        if correct_node.link:
            if not test_node.link:
                errors.append(f'El nodo ({test_node.id}, {test_node.coordinate}) no tiene link pero deberia')
                staus = False
            elif correct_node.link != test_node.link:
                errors.append(f'El nodo ({test_node.id}, {test_node.coordinate}) tiene un link incorrecto')
                staus = False

        elif correct_node.linkRotation != test_node.linkRotation:
            errors.append(f'El nodo ({test_node.id}, {test_node.coordinate}) tiene una link rotation incorrecta')
            staus = False

        if len(test_node.forces):
            if len(correct_node.forces):
                test_forces = sorted(test_node.forces, key=lambda x: (x[0], x[1]))
                correct_forces = sorted(correct_node.forces, key=lambda x: (x[0], x[1]))
                for i in range(len(test_forces)):
                    correct_mag = force_in_newtons(correct_forces[i])
                    test_mag = force_in_newtons(test_forces[i])
                    acceptable = acceptable_error(correct_mag, test_mag)
                    if not acceptable:
                        errors.append(f'El nodo ({test_node.id}, {test_node.coordinate}) difiere en la fuerza {test_forces[i]}')
                        staus = False

                    if correct_forces[i][1] != test_forces[i][1]:
                        errors.append(f'El nodo ({test_node.id}, {test_node.coordinate}) tiene una direccion incorrecta en la fuerza {test_forces[i]}')
                        staus = False
                    # esta mal implementado podria haber 1000N y 1kN  y estaria mal! 
            else :
                errors.append(f'El nodo ({test_node.id}, {test_node.coordinate}) tiene fuerzas que no existen en el grafo correcto')
                staus = False
        else :
            if len(correct_node.forces):
                errors.append(f'El nodo ({test_node.id}, {test_node.coordinate}) no tiene fuerzas que existen en el grafo correcto')
                staus = False

        if len(test_node.moments):
            if len(correct_node.moments):
                test_moments = sorted(test_node.moments, key=lambda x: (x[0], x[1]))
                correct_moments = sorted(correct_node.moments, key=lambda x: (x[0], x[1]))
                for i in range(len(test_moments)):
                    correct_mag = moment_in_newton_meters(correct_moments[i])
                    test_mag = moment_in_newton_meters(test_moments[i])
                    acceptable = acceptable_error(correct_mag, test_mag)
                    if not acceptable:
                        errors.append(f'El nodo ({test_node.id}, {test_node.coordinate}) difiere en el momento {test_moments[i]}')
                        staus = False
            else:
                errors.append(f'El nodo ({test_node.id}, {test_node.coordinate}) tiene momentos que no existen en el grafo correcto')
                staus = False
        else:
            if len(correct_node.moments):
                errors.append(f'El nodo ({test_node.id}, {test_node.coordinate}) no tiene momentos que existen en el grafo correcto')
                staus = False
        
        if correct_node.isOrigin != test_node.isOrigin:
            errors.append(f'El nodo ({test_node.id}, {test_node.coordinate}) tiene isOrigin incorrecto')
            staus = False

        if len(correct_dict) > len(test_dict):
            errors.append(f'El grafo tiene menos nodos que el correcto')
            staus = False

        elif len(correct_dict) < len(test_dict):
            errors.append(f'El grafo tiene mas nodos que el correcto')
            staus = False
    
    
    return {'status': correct_dict == test_dict and staus, 'errors': errors}


def force_in_newtons(force):
    magnitude = force[0]
    type = force[2]
    if type == 'N':
        return magnitude
    elif type == 'kN':
        return magnitude * 1000
    elif type == 'kip':
        return magnitude * 4448.2216

def moment_in_newton_meters(moment):
    magnitude = moment[0]
    type = moment[1]
    if type == 'N*m':
        return magnitude
    elif type == 'kN*m':
        return magnitude * 1000
    elif type == 'kip*ft':
        return magnitude * 4448.2216 * 0.3048

def moment_in_newton_meters_step_3(moment):
    sign = moment[0]
    if (sign == '-'):
        sign = -1
    else:
        sign = 1
    magnitude = moment[1]
    type = moment[2]
    if type == 'N*m':
        return magnitude * sign
    elif type == 'kN*m':
        return magnitude * 1000 * sign
    elif type == 'kip*ft':
        return magnitude * 4448.2216 * 0.3048 * sign

def acceptable_error(correct, test):
    return abs(correct - test) <= ERROR
    


def verify_step_3(correct_graph, test_graph):
    all_correct_nodes = sorted(list(correct_graph.get_all_descendants()), key=lambda x: x.id)
    all_test_nodes = sorted(list(test_graph.get_all_descendants()), key=lambda x: x.id)
    
    correct = True

    errors = []

    for i in range(len(all_correct_nodes)):
        correct_node = all_correct_nodes[i]
        test_node = all_test_nodes[i]
        
        correctForcesX = correct_node.step3["forcesX"]
        testForcesX = test_node.step3["forcesX"]
        

        correctForcesY = sorted(list(correct_node.step3["forcesY"]))
        testForcesY = sorted(list(test_node.step3["forcesY"]))

        sameFx = True
        for i in range(len(correctForcesX)):
            correctForce = correctForcesX[i]
            try:
                testForce = testForcesX[i]
                if correctForce[3]: 
                    correctTrigonometric = eval(correctForce[3], {"cos": cosInDegrees, "sin": sinInDegrees})
                    testTrigonometric = eval(testForce[3], {"cos": cosInDegrees, "sin": sinInDegrees})
                    acceptable = acceptable_error(correctTrigonometric, testTrigonometric)
                    if not acceptable:
                        sameFx = False
                sameFx = sameFx and correctForce[0] == testForce[0] and correctForce[1] == testForce[1] and correctForce[2] == testForce[2]
            except:
                sameFx = False
                
            
        correct = correct and sameFx


        sameFy = True
        for i in range(len(correctForcesY)):
            correctForce = correctForcesY[i]
            try:
                testForce = testForcesY[i]
                if correctForce[3]: 
                    correctTrigonometric = eval(correctForce[3], {"cos": cosInDegrees, "sin": sinInDegrees})
                    testTrigonometric = eval(testForce[3], {"cos": cosInDegrees, "sin": sinInDegrees})
                    acceptable = acceptable_error(correctTrigonometric, testTrigonometric)
                    if not acceptable:
                        sameFy = False
                sameFy = sameFy and correctForce[0] == testForce[0] and correctForce[1] == testForce[1] and correctForce[2] == testForce[2]
            except:
                sameFy = False
                
            
        correct = correct and sameFy
        sameM = True
        for i in range(len(correct_node.step3["moments"])):
            correctMoment = correct_node.step3["moments"][i]
            try:
                testMoment = test_node.step3["moments"][i]
                testMoment = moment_in_newton_meters_step_3(testMoment)
                correctMoment = moment_in_newton_meters_step_3(correctMoment)

                sameM = sameM and acceptable_error(correctMoment, testMoment)
            except:
                sameM = False
                

        correct = correct and sameM

        sameAXS = True
        for i in range(len(correct_node.step3["axisXsupport"])):
            correctForce = correct_node.step3["axisXsupport"][i]
            try:
                testForce = test_node.step3["axisXsupport"][i]
                sameAXS = sameAXS and correctForce[0] == testForce[0] and correctForce[1] == testForce[1] and eval(correctForce[2], {"cos": cosInDegrees, "sin": sinInDegrees}) == eval(testForce[2], {"cos": cosInDegrees, "sin": sinInDegrees})
                
            except:
                sameAXS = False

        correct = correct and sameAXS

        sameAYS = True
        for i in range(len(correct_node.step3["axisYsupport"])):
            correctForce = sorted(correct_node.step3["axisYsupport"])[i]
            print(f"correctForce: {correctForce}")
            try:
                testForce = sorted(test_node.step3["axisYsupport"])[i]
                sameAYS = sameAYS and correctForce[0] == testForce[0] and correctForce[1] == testForce[1] and eval(correctForce[2], {"cos": cosInDegrees, "sin": sinInDegrees}) == eval(testForce[2], {"cos": cosInDegrees, "sin": sinInDegrees})
            except:
                sameAYS = False

        correct = correct and sameAYS

        sameMS = True
        if len(correct_node.step3["momentsSupport"]) != len(test_node.step3["momentsSupport"]):
            sameMS = False

        correct = correct and sameMS


    return {"status": correct, "errors": errors}

def cosInDegrees(degrees):
    return math.cos(math.radians(degrees))

def sinInDegrees(degrees):
    return math.sin(math.radians(degrees))

