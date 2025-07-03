
# ✅ Step 1: Upload the dataset
from google.colab import files
uploaded = files.upload()

# ✅ Step 2: Load the dataset
import pandas as pd

df = pd.read_csv("livestock_disease.csv")
df.head()

# ✅ Step 3: Train Random Forest Classifier
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score

# Separate features and target
X = df.drop("Disease", axis=1)
y = df["Disease"]

# Define categorical and numerical columns
categorical_cols = ["Animal", "Symptom 1", "Symptom 2", "Symptom 3"]
numerical_cols = ["Age", "Temperature"]

# Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
    ],
    remainder='passthrough'
)

# Build the pipeline
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
pipeline.fit(X_train, y_train)

# Predict and evaluate
y_pred = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")
