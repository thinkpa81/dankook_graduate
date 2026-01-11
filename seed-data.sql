-- 공지사항 데이터 삽입
INSERT INTO notices (title, content, date, views, is_important, files) VALUES
('2025학년도 봄학기 신입생 모집 안내', 
'단국대학교 일반대학원 데이터지식서비스공학과에서 2025학년도 봄학기 신입생을 모집합니다.

주요 모집 분야:
- 데이터사이언스 전공
- AI/머신러닝 전공
- 메타버스융합 전공

지원 자격:
- 학사 학위 소지자 (예정자 포함)
- 관련 분야 경력자 우대

제출 서류:
- 입학지원서
- 학부 성적증명서
- 자기소개서 및 연구계획서

문의: 데이터지식서비스공학과 행정실 (031-8005-XXXX)', 
'2025-01-10', 156, true, '{}'),

('2025년 1월 학위논문 제출 일정 안내', 
'2025년 2월 학위수여를 희망하는 석·박사 과정 학생은 아래 일정에 따라 학위논문을 제출해 주시기 바랍니다.

학위논문 제출 일정:
- 논문 심사 신청: 2025년 1월 5일 ~ 1월 15일
- 논문 심사: 2025년 1월 20일 ~ 2월 5일
- 최종 논문 제출: 2025년 2월 10일까지
- 학위수여식: 2025년 2월 20일

제출 방법:
- 온라인 제출 시스템 이용
- 인쇄본 3부 행정실 제출

문의: 학사관리팀', 
'2025-01-08', 89, true, '{}'),

('AI/머신러닝 특강 안내 - ChatGPT와 대화형 AI', 
'AI 전문가를 초청하여 특강을 개최합니다.

주제: ChatGPT와 대화형 AI의 최신 동향
강사: 김AI 교수 (서울대학교 AI연구소)
일시: 2025년 1월 25일 (토) 14:00-16:00
장소: 단국대학교 산학협력관 301호

참가 신청:
- 신청 기간: 1월 15일까지
- 신청 방법: 학과 홈페이지 또는 이메일
- 정원: 50명 (선착순)

참가비: 무료
수료증 발급: 참석자 전원', 
'2025-01-05', 124, false, '{}'),

('메타버스 프로젝트 발표회 개최', 
'메타버스융합 전공 학생들의 학기 프로젝트 발표회를 개최합니다.

일시: 2025년 1월 30일 (목) 13:00-17:00
장소: 메타버스 연구실 (공학관 5층)

발표 주제:
- 가상 캠퍼스 구축 프로젝트
- NFT 기반 디지털 아트 플랫폼
- VR/AR 교육 콘텐츠 개발
- 메타버스 전자상거래 시스템

참관 환영: 학부생, 대학원생, 교수님 모두 환영합니다.', 
'2025-01-03', 67, false, '{}');

-- 논문 데이터 삽입
INSERT INTO papers (category, title, authors, first_author, corresponding_author, venue, journal, volume, year, abstract, keywords, files, website_url, date, views) VALUES
('international-journal', 
'Deep Learning-Based Sentiment Analysis in Metaverse Social Platforms', 
'김철수, 이영희, 박민수', 
'김철수', 
'박민수', 
NULL, 
'IEEE Transactions on Computational Social Systems', 
'Vol.11, No.2', 
'2024', 
'This paper presents a novel deep learning approach for sentiment analysis in metaverse social platforms. We propose a multi-modal transformer architecture that processes text, audio, and avatar expressions to accurately predict user emotions in virtual environments.', 
'{"Deep Learning","Sentiment Analysis","Metaverse","Social Computing"}', 
'{}', 
'https://ieeexplore.ieee.org/document/example', 
'2024-12-15', 234),

('domestic-journal', 
'메타버스 환경에서의 사용자 행동 패턴 분석 연구', 
'장순호, 홍길동, 김AI', 
'장순호', 
'김AI', 
NULL, 
'한국정보과학회 논문지', 
'제51권 제12호', 
'2024', 
'본 연구는 메타버스 플랫폼에서 사용자들의 행동 패턴을 데이터 마이닝 기법을 통해 분석하였다. 로그 데이터 분석 결과, 사용자들의 가상공간 이동 패턴과 소셜 인터랙션 간 유의미한 상관관계를 발견하였다.', 
'{"메타버스","사용자 행동 분석","데이터 마이닝","소셜 네트워크"}', 
'{}', 
NULL, 
'2024-12-01', 156),

('international-conference', 
'AI-Powered Recommendation System for Virtual Reality Content', 
'박데이터, 이머신, Smith, J.', 
'박데이터', 
'Smith, J.', 
'ACM International Conference on Multimedia (ACM MM 2024)', 
NULL, 
NULL, 
'2024', 
'We propose an AI-powered recommendation system specifically designed for VR content. Our system uses collaborative filtering combined with deep reinforcement learning to provide personalized content recommendations based on user interaction patterns in 3D environments.', 
'{"VR","Recommendation System","Deep Learning","User Experience"}', 
'{}', 
'https://dl.acm.org/doi/example', 
'2024-11-20', 189),

('domestic-conference', 
'블록체인 기반 메타버스 디지털 자산 거래 시스템', 
'최블록, 강체인, 서메타', 
'최블록', 
'서메타', 
'한국정보과학회 학술발표논문집', 
NULL, 
NULL, 
'2024', 
'메타버스 환경에서 디지털 자산의 안전한 거래를 위한 블록체인 기반 시스템을 제안한다. 스마트 컨트랙트를 활용하여 거래의 투명성과 보안을 보장하며, NFT 기술을 통해 디지털 자산의 소유권을 명확히 한다.', 
'{"블록체인","메타버스","NFT","스마트 컨트랙트","디지털 자산"}', 
'{}', 
NULL, 
'2024-11-15', 142),

('international-journal', 
'Federated Learning for Privacy-Preserving Data Analysis in IoT Networks', 
'이프라이버시, Johnson, M., 김보안', 
'이프라이버시', 
'김보안', 
NULL, 
'IEEE Internet of Things Journal', 
'Vol.11, No.24', 
'2024', 
'This paper proposes a federated learning framework for privacy-preserving data analysis in IoT networks. Our approach enables collaborative model training across distributed IoT devices without sharing raw data, ensuring user privacy while maintaining model accuracy.', 
'{"Federated Learning","IoT","Privacy","Machine Learning","Data Security"}', 
'{}', 
'https://ieeexplore.ieee.org/document/iot-example', 
'2024-10-30', 201),

('domestic-journal', 
'자연어 처리 기반 한국어 감성 분석 시스템 개발', 
'정자연어, 한글처리, 감성분석', 
'정자연어', 
'감성분석', 
NULL, 
'정보과학회논문지', 
'제50권 제10호', 
'2024', 
'한국어 텍스트의 감성을 정확하게 분석하기 위한 딥러닝 기반 시스템을 개발하였다. BERT 모델을 한국어 데이터로 사전학습하고, 감성 라벨링된 데이터셋으로 파인튜닝하여 기존 방법 대비 15% 향상된 성능을 달성하였다.', 
'{"자연어 처리","감성 분석","BERT","한국어","딥러닝"}', 
'{}', 
NULL, 
'2024-10-15', 178);
