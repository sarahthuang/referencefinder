#Imports
from flask import Flask, request, jsonify, render_template
import firebase_admin
from firebase_admin import credentials, firestore

#Initialize Firestore DB
cred = credentials.Certificate("/Users/sarahhuang/Desktop/referencefinder/referencefinder-63aad-firebase-adminsdk-ai79z-ac51d56eeb.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
tasks = db.collection('tasks')
Folder_1 = db.collection('Folder_1')
Folder_2 = db.collection('Folder_2')
Folder_3 = db.collection('Folder_3')
Folder_10_8_21 = db.collection('Folder_10_8_21')
Folder_10_10_21 = db.collection('Folder_10_10_21')
Folder_10_11_21 = db.collection('Folder_10_11_21')
Folder_10_12_21 = db.collection('Folder_10_12_21')
all_tasks = [(doc.id, doc.to_dict()) for doc in tasks.stream()]
all_f1 = [(doc.id, doc.to_dict()) for doc in Folder_1.stream()]
all_f2 = [(doc.id, doc.to_dict()) for doc in Folder_2.stream()]
all_f3 = [(doc.id, doc.to_dict()) for doc in Folder_3.stream()]
all_f4 = [(doc.id, doc.to_dict()) for doc in Folder_10_8_21.stream()] 
all_f5 = [(doc.id, doc.to_dict()) for doc in Folder_10_10_21.stream()] 
all_f6 = [(doc.id, doc.to_dict()) for doc in Folder_10_11_21.stream()] 
all_f7 = [(doc.id, doc.to_dict()) for doc in Folder_10_12_21.stream()] 
total = [all_tasks, all_f1, all_f2, all_f3, all_f4, all_f5, all_f6, all_f7]

#Initialize Flask App
app = Flask(__name__)

#Source code from: https://cloud.google.com/community/tutorials/building-flask-api-with-cloud-firestore-and-deploying-to-cloud-run

#Create Data
@app.route('/add', methods=['POST'])
def create():
    """
        create() : Add document to Firestore collection with request body.
        Ensure you pass a custom ID as part of json body in post request,
        e.g. json={'id': '1', 'title': 'Write a blog post'}
    """
    try:
        all_todos = [(doc.to_dict(), doc.id) for doc in tasks.stream()]
        len_entries = str(len(all_todos) + 1)
        data = {
            u'content': request.json
        }
        tasks.document().set(data)
        docs = tasks.stream()
        new_id = [doc.to_dict()['content'] for doc in tasks.stream()]
        for doc in docs:
            if doc.to_dict()['content'] == request.json:
                new_id = doc.id
        return jsonify({"success": True, "id": new_id}), 200
    except Exception as e:
        return f"An Error Occured: {e}"

#Read Data
@app.route('/list', methods=['GET'])
def read():
    """
        read() : Fetches documents from Firestore collection as JSON.
        todo : Return document that matches query ID.
        all_todos : Return all documents.
    """
    try:
        # Check if ID was passed to URL query
        todo_id = request.args.get('id')
        if todo_id:
            todo = tasks.document(todo_id).get()
            return jsonify(todo.to_dict()), 200
        else:
            # print(total)
            return jsonify(total), 200
    except Exception as e:
        return f"An Error Occured: {e}"

#Update Data
@app.route('/update', methods=['GET', 'POST'])
def update():
    """
        update() : Update document in Firestore collection with request body.
        Ensure you pass a custom ID as part of json body in post request,
        e.g. json={'id': '1', 'title': 'Write a blog post today'}
    """
    try:
        id = request.json['id']
        print("-----------------------")
        print(request.json)
        print("-----------------------")
        col = ''
        for i in (range(len(total))):
            doc_len = len(total[i])
            for j in range(doc_len):
                if total[i][j][0] == id:
                    col = total[i][j][1]['col']
        db.collection(str(col)).document(id).update(request.json)
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"


#Delete Data
@app.route('/delete', methods=['GET', 'DELETE'])
def delete():
    """
        delete() : Delete a document from Firestore collection.
    """
    try:
        # Check for ID in URL query
        todo_id = request.args.get('id')
        
        col = ''
        for i in (range(len(total))):
            doc_len = len(total[i])
            for j in range(doc_len):
                if total[i][j][0] == id:
                    col = total[i][j][1]['col']
    
        db.collection(str(col)).document(todo_id).delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"

#Search Data
@app.route('/search', methods=['GET', 'POST'])
def search():
    """
        search() : Search for a document from Firestore collection.
    """
    try:
        term = request.args.get('term')
        entries = []
        for i in range(len(total)):
            for j in range(len(total[i])):
                if term in total[i][j][1]['colors']:
                    print(total[i][j][1]['colors'])
                    entries.append(total[i][j])
        return jsonify(entries), 200
    except Exception as e:
        return f"An Error Occured: {e}"

@app.route('/project_page', methods=['GET', 'POST'])
def project_page():
    return render_template('project_page.html') 

@app.route('/bookmark_selection_page', methods=['GET', 'POST'])
def bookmark_selection_page():
     return render_template('bookmark_selection_page.html') 

@app.route('/')
def home():
     return render_template('home_page.html') 

if __name__ == '__main__':
   app.run(debug = True)

