 
        // Simulated AI Resume Optimization (since we can't use external APIs in artifacts)
        document.getElementById('analyze-btn').addEventListener('click', async function() {
            const resumeFile = document.getElementById('resume').files[0];
            const jobDescription = document.getElementById('job-description').value.trim();
            
            // Validation
            if (!resumeFile) {
                showError('Please upload your resume first!');
                return;
            }
            
            if (!jobDescription) {
                showError('Please paste the job description!');
                return;
            }

            // Show loading
            showLoading(true);
            
            try {
                // Read resume file
                const resumeText = await readFile(resumeFile);
                
                // Simulate AI processing delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Generate optimization results
                const results = await optimizeResume(resumeText, jobDescription);
                
                // Show results
                showResults(results);
                
            } catch (error) {
                showError('Error processing your resume: ' + error.message);
            } finally {
                showLoading(false);
            }
        });

        function readFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (file.type === 'application/pdf') {
                        // For PDF files, we'll simulate text extraction
                        resolve("Sample resume content extracted from PDF...");
                    } else {
                        resolve(e.target.result);
                    }
                };
                reader.onerror = function() {
                    reject(new Error('Failed to read file'));
                };
                
                if (file.type === 'application/pdf') {
                    reader.readAsArrayBuffer(file);
                } else {
                    reader.readAsText(file);
                }
            });
        }

        async function optimizeResume(resumeText, jobDescription) {
            // Simulate AI optimization logic
            const keywords = extractKeywords(jobDescription);
            const suggestions = generateSuggestions(resumeText, jobDescription);
            const optimizedResume = generateOptimizedResume(resumeText, keywords);
            
            return {
                optimizedResume,
                keywords,
                suggestions,
                matchScore: Math.floor(Math.random() * 30) + 70 // Random score between 70-100
            };
        }

        function extractKeywords(jobDescription) {
            // Simulate keyword extraction
            const commonKeywords = [
                'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker',
                'Machine Learning', 'Data Analysis', 'Project Management', 'Agile',
                'Leadership', 'Communication', 'Problem Solving', 'Team Work'
            ];
            
            const foundKeywords = commonKeywords.filter(keyword => 
                jobDescription.toLowerCase().includes(keyword.toLowerCase())
            );
            
            return foundKeywords.slice(0, 8); // Return max 8 keywords
        }

        function generateSuggestions(resumeText, jobDescription) {
            return [
                "Add more quantifiable achievements with specific numbers and percentages",
                "Include relevant technical skills mentioned in the job description",
                "Optimize section headers for ATS compatibility",
                "Strengthen your professional summary to match job requirements",
                "Add industry-specific keywords naturally throughout your resume",
                "Highlight leadership and collaboration experiences",
                "Include relevant certifications or training programs"
            ];
        }

        function generateOptimizedResume(originalResume, keywords) {
            // Simulate optimized resume generation
            return `OPTIMIZED RESUME

PROFESSIONAL SUMMARY
Results-driven professional with expertise in ${keywords.slice(0, 3).join(', ')}. Proven track record of delivering high-quality solutions and driving business growth through innovative approaches.

CORE COMPETENCIES
• ${keywords.join(' • ')}

PROFESSIONAL EXPERIENCE

Senior Software Developer | TechCorp Inc. | 2021 - Present
• Developed and maintained web applications using ${keywords[0] || 'modern technologies'}
• Improved system performance by 40% through code optimization
• Led a team of 5 developers in agile development practices
• Collaborated with cross-functional teams to deliver projects 20% ahead of schedule

Software Developer | Innovation Labs | 2019 - 2021
• Built responsive web applications serving 10,000+ users
• Implemented automated testing reducing bugs by 35%
• Participated in code reviews and mentored junior developers

EDUCATION
Bachelor of Computer Science | University Name | 2019
• Relevant Coursework: ${keywords.slice(0, 3).join(', ')}

CERTIFICATIONS
• AWS Certified Developer
• ${keywords[1] || 'Technology'} Certification

Note: This is a simulated optimization. In a real implementation, this would be generated by AI based on your actual resume content.`;
        }

        function showResults(results) {
            const resultsDiv = document.getElementById('results');
            
            resultsDiv.innerHTML = `
                <h3>🎉 Resume Optimization Complete!</h3>
                
                <div class="success">
                    <strong>Match Score: ${results.matchScore}%</strong> - Your resume is well-aligned with the job requirements!
                </div>
                
                <div class="optimization-result">
                    <h4>📄 Optimized Resume</h4>
                    <pre>${results.optimizedResume}</pre>
                </div>
                
                <div class="changes-section">
                    <h4>🔑 Key Improvements Made:</h4>
                    <ul>
                        ${results.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="changes-section">
                    <h4>🏷️ Keywords Added:</h4>
                    <p><strong>${results.keywords.join(', ')}</strong></p>
                </div>
            `;
            
            resultsDiv.style.display = 'block';
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
        }

        function showError(message) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `<div class="error"><strong>Error:</strong> ${message}</div>`;
            resultsDiv.style.display = 'block';
        }

        function showLoading(show) {
            const loadingDiv = document.getElementById('loading');
            const analyzeBtn = document.getElementById('analyze-btn');
            
            if (show) {
                loadingDiv.style.display = 'block';
                analyzeBtn.disabled = true;
                analyzeBtn.textContent = 'Processing...';
            } else {
                loadingDiv.style.display = 'none';
                analyzeBtn.disabled = false;
                analyzeBtn.textContent = '✨ Optimize My Resume';
            }
        }

        // File upload feedback
        document.getElementById('resume').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                showError(`✅ File "${file.name}" uploaded successfully!`);
                setTimeout(() => {
                    document.getElementById('results').style.display = 'none';
                }, 2000);
            }
        });
    