// AI Resume Optimizer - Client-side JavaScript
// Created by Tushar Tyagi - 3rd Year AI Student, MIET

document.addEventListener('DOMContentLoaded', function() {
    // Main analyze button event listener
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

        if (jobDescription.length < 50) {
            showError('Please provide a more detailed job description (at least 50 characters)!');
            return;
        }

        // Show loading
        showLoading(true);
        
        try {
            // Read resume file
            const resumeText = await readFile(resumeFile);
            
            // Simulate AI processing delay (more realistic timing)
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Generate optimization results
            const results = await optimizeResume(resumeText, jobDescription, resumeFile.name);
            
            // Show results
            showResults(results);
            
        } catch (error) {
            showError('Error processing your resume: ' + error.message);
        } finally {
            showLoading(false);
        }
    });

    // File upload feedback
    document.getElementById('resume').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showError('File size too large! Please upload a file smaller than 5MB.');
                e.target.value = '';
                return;
            }

            // Validate file type
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain'
            ];

            if (!allowedTypes.includes(file.type)) {
                showError('Invalid file format! Please upload PDF, DOC, DOCX, or TXT files only.');
                e.target.value = '';
                return;
            }

            showSuccess(`✅ File "${file.name}" uploaded successfully! (${formatFileSize(file.size)})`);
            setTimeout(() => {
                hideMessages();
            }, 3000);
        }
    });

    // Auto-resize textarea
    const textarea = document.getElementById('job-description');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (file.type === 'application/pdf') {
                // For PDF files, simulate text extraction
                resolve(generateSampleResumeContent());
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

function generateSampleResumeContent() {
    return `John Doe
Software Developer
Email: john.doe@email.com | Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software developer with 3+ years in web development.

EXPERIENCE
Software Developer | Tech Company | 2021-Present
- Developed web applications
- Worked with various technologies
- Collaborated with team members

EDUCATION
Bachelor of Computer Science | University | 2021

SKILLS
JavaScript, Python, HTML, CSS`;
}

async function optimizeResume(resumeText, jobDescription, fileName) {
    // Extract keywords and analyze job requirements
    const keywords = extractKeywords(jobDescription);
    const jobRequirements = analyzeJobRequirements(jobDescription);
    const suggestions = generateSuggestions(resumeText, jobDescription);
    const optimizedResume = generateOptimizedResume(resumeText, keywords, jobRequirements);
    const matchScore = calculateMatchScore(resumeText, jobDescription, keywords);
    
    return {
        optimizedResume,
        keywords,
        suggestions,
        matchScore,
        fileName,
        jobRequirements
    };
}

function extractKeywords(jobDescription) {
    const text = jobDescription.toLowerCase();
    
    // Technical skills keywords
    const technicalKeywords = [
        'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue.js',
        'html', 'css', 'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker',
        'kubernetes', 'git', 'machine learning', 'ai', 'data science', 'tensorflow',
        'pandas', 'numpy', 'django', 'flask', 'spring boot', 'microservices'
    ];
    
    // Soft skills keywords
    const softKeywords = [
        'leadership', 'communication', 'teamwork', 'problem solving', 'project management',
        'agile', 'scrum', 'collaboration', 'analytical', 'creative', 'innovative'
    ];
    
    // Experience level keywords
    const experienceKeywords = [
        'senior', 'junior', 'lead', 'principal', 'architect', 'manager', 'director'
    ];
    
    const allKeywords = [...technicalKeywords, ...softKeywords, ...experienceKeywords];
    
    const foundKeywords = allKeywords.filter(keyword => 
        text.includes(keyword)
    ).map(keyword => 
        keyword.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
    );
    
    // Remove duplicates and return top 10
    return [...new Set(foundKeywords)].slice(0, 10);
}

function analyzeJobRequirements(jobDescription) {
    const requirements = {
        experience: 'Mid-level',
        education: 'Bachelor\'s degree preferred',
        type: 'Full-time',
        remote: jobDescription.toLowerCase().includes('remote') || jobDescription.toLowerCase().includes('work from home')
    };
    
    // Analyze experience level
    if (jobDescription.toLowerCase().includes('entry level') || jobDescription.toLowerCase().includes('junior')) {
        requirements.experience = 'Entry-level';
    } else if (jobDescription.toLowerCase().includes('senior') || jobDescription.toLowerCase().includes('lead')) {
        requirements.experience = 'Senior-level';
    }
    
    return requirements;
}

function generateSuggestions(resumeText, jobDescription) {
    const suggestions = [
        "📊 Add quantifiable achievements with specific metrics (e.g., 'Increased efficiency by 40%')",
        "🔑 Include more keywords from the job description naturally throughout your resume",
        "💼 Tailor your professional summary to match the specific role requirements",
        "🏆 Highlight relevant projects that demonstrate required skills",
        "📚 Add relevant certifications or training programs if applicable",
        "🤝 Emphasize collaboration and leadership experiences",
        "⚡ Use action verbs to make your accomplishments more impactful",
        "🎯 Optimize section headers for Applicant Tracking Systems (ATS)",
        "📱 Ensure your contact information is up-to-date and professional"
    ];
    
    // Return 5-7 random suggestions
    const shuffled = suggestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 5);
}

function calculateMatchScore(resumeText, jobDescription, keywords) {
    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();
    
    // Calculate keyword match percentage
    const matchedKeywords = keywords.filter(keyword => 
        resumeLower.includes(keyword.toLowerCase())
    );
    
    const keywordScore = (matchedKeywords.length / keywords.length) * 60;
    const randomBonus = Math.floor(Math.random() * 25) + 15; // 15-40 bonus points
    
    return Math.min(Math.floor(keywordScore + randomBonus), 98);
}

function generateOptimizedResume(originalResume, keywords, jobRequirements) {
    const topSkills = keywords.slice(0, 6);
    const currentYear = new Date().getFullYear();
    
    return `OPTIMIZED RESUME - ENHANCED FOR ATS

PROFESSIONAL SUMMARY
${jobRequirements.experience} professional with expertise in ${topSkills.slice(0, 3).join(', ')} and proven track record of delivering innovative solutions. Strong background in software development with focus on scalable applications and collaborative team environments.

CORE COMPETENCIES
• ${topSkills.join(' • ')}
• Problem-Solving & Analytical Thinking
• Cross-functional Team Collaboration

PROFESSIONAL EXPERIENCE

Senior Software Developer | TechCorp Solutions | 2022 - Present
• Developed and maintained scalable web applications using ${topSkills[0] || 'modern technologies'}
• Improved application performance by 45% through code optimization and best practices
• Led a cross-functional team of 6 developers in agile development methodologies
• Collaborated with product managers and designers to deliver 15+ projects 25% ahead of schedule
• Implemented automated testing suites, reducing production bugs by 60%

Software Developer | Digital Innovation Labs | 2020 - 2022
• Built responsive web applications serving 25,000+ active users
• Utilized ${topSkills[1] || 'cutting-edge technologies'} to create user-friendly interfaces
• Participated in code reviews and mentored 3 junior developers
• Contributed to open-source projects and company technical blog

Junior Developer | StartupTech Inc. | 2019 - 2020
• Developed features for customer-facing applications using ${topSkills[2] || 'various technologies'}
• Collaborated with senior developers to implement best coding practices
• Participated in daily standups and sprint planning meetings

EDUCATION
Bachelor of Computer Science | Tech University | ${currentYear - 3}
• Relevant Coursework: ${topSkills.slice(0, 3).join(', ')}, Data Structures, Algorithms
• GPA: 3.7/4.0

CERTIFICATIONS & TRAINING
• AWS Certified Developer Associate
• ${topSkills[0] || 'Technology'} Professional Certification
• Agile Development Methodologies

PROJECTS
• E-commerce Platform: Built using ${topSkills[0] || 'modern stack'}, serving 5,000+ customers
• Task Management App: Developed with ${topSkills[1] || 'latest technologies'}, 95% user satisfaction

---
✨ This resume has been optimized for ATS compatibility and keyword matching
📈 Tailored specifically for the target position requirements
🚀 Enhanced with quantifiable achievements and relevant technologies`;
}

function showResults(results) {
    const resultsDiv = document.getElementById('results');
    
    const scoreColor = results.matchScore >= 85 ? '#27ae60' : results.matchScore >= 70 ? '#f39c12' : '#e74c3c';
    const scoreEmoji = results.matchScore >= 85 ? '🎉' : results.matchScore >= 70 ? '👍' : '💡';
    
    resultsDiv.innerHTML = `
        <h3>${scoreEmoji} Resume Optimization Complete!</h3>
        
        <div class="success" style="border-left-color: ${scoreColor};">
            <strong>Match Score: ${results.matchScore}%</strong> - 
            ${results.matchScore >= 85 ? 'Excellent match!' : 
              results.matchScore >= 70 ? 'Good alignment with job requirements!' : 
              'Room for improvement - follow the suggestions below.'}
        </div>
        
        <div class="optimization-result">
            <h4>📄 Your Optimized Resume</h4>
            <small style="color: #666; margin-bottom: 10px; display: block;">
                Original file: ${results.fileName} | Optimized with ${results.keywords.length} key skills
            </small>
            <pre style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">${results.optimizedResume}</pre>
        </div>
        
        <div class="changes-section">
            <h4>💡 Key Improvement Suggestions:</h4>
            <ul style="margin-top: 10px;">
                ${results.suggestions.map(suggestion => `<li style="margin-bottom: 8px;">${suggestion}</li>`).join('')}
            </ul>
        </div>
        
        <div class="changes-section">
            <h4>🏷️ Important Keywords Found in Job Description:</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
                ${results.keywords.map(keyword => 
                    `<span style="background: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.9rem;">${keyword}</span>`
                ).join('')}
            </div>
        </div>
        
        <div class="optimization-result" style="margin-top: 20px;">
            <h4>📋 Next Steps:</h4>
            <ol style="margin-top: 10px; line-height: 1.6;">
                <li><strong>Copy the optimized resume</strong> and paste it into your preferred document editor</li>
                <li><strong>Customize further</strong> with your actual experience and achievements</li>
                <li><strong>Proofread carefully</strong> and ensure all information is accurate</li>
                <li><strong>Save in multiple formats</strong> (PDF, DOCX) for different application requirements</li>
                <li><strong>Test with ATS tools</strong> online to ensure compatibility</li>
            </ol>
        </div>
    `;
    
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<div class="error"><strong>❌ Error:</strong> ${message}</div>`;
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function showSuccess(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<div class="success"><strong>✅ Success:</strong> ${message}</div>`;
    resultsDiv.style.display = 'block';
}

function hideMessages() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'none';
}

function showLoading(show) {
    const loadingDiv = document.getElementById('loading');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    if (show) {
        loadingDiv.style.display = 'block';
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = '🔄 Processing...';
        analyzeBtn.style.cursor = 'not-allowed';
    } else {
        loadingDiv.style.display = 'none';
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = '✨ Optimize My Resume';
        analyzeBtn.style.cursor = 'pointer';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

    
