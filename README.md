# chatbot-ai
Chatbot interface using Sara

**run-actions:**
	python -m rasa_core_sdk.endpoint --actions actions

train-nlu:
	python -m rasa_nlu.train -c nlu_tensorflow.yml --fixed_model_name current --data data/nlu/ -o models --project nlu --verbose

train-core:
	python -m rasa_core.train -d domain.yml -s data/core/stories.md -o models/dialogue

**run:**
	python -m rasa_core.run --enable_api -d models/dialogue -u models/nlu/default/indi_nlu --debug --endpoints endpoints.yml --cors "*"

visualize:
	python -m rasa_core.visualize -s data/core/ -d domain.yml -o story_graph.png

train-online:
	python -m rasa_core.train -u models/nlu/default/indi_nlu --online --core models/dialogue/

evaluate-core:
	python -m rasa_core.evaluate --core models/dialogue -s data/core/ --fail_on_prediction_errors


Thanks to : anishmahapatra01
